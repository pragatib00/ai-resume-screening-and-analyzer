from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import json

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

from app.services.pdf_service import (
    extract_text_from_pdf
)

from app.services.llm_service import (
    extract_resume_information,
    extract_job_information
)

from app.services.scoring_service import (
    calculate_ats_score
)

from app.services.suggestion_service import (
    generate_suggestions
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


def _build_job_data(job):
    """
    Shared helper so upload_resume and the analysis endpoint always
    score against the exact same job_data. Skills come directly from
    the structured `required_skills` field the recruiter typed in
    Create Job, rather than being re-extracted by the LLM from free
    text -- that field is already clean, so re-parsing it only added
    a chance of extraction failure (which, combined with the old
    scoring defaults, was the source of the 100% ATS score bug).
    Education / projects / certifications / experience still come
    from the freeform description, since those aren't captured as
    structured fields.
    """

    job_data = extract_job_information(job.description)

    job_data["skills"] = [
        s.strip()
        for s in (job.required_skills or "").split(",")
        if s.strip()
    ]

    return job_data


# =====================================================
# Apply for Job
# =====================================================

@router.post(
    "/",
    response_model=schemas.ApplicationResponse
)
def apply_job(
    application: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    if current_user.role != "candidate":

        raise HTTPException(
            status_code=403,
            detail="Only candidates can apply."
        )

    job = db.query(models.Job).filter(
        models.Job.id == application.job_id
    ).first()

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    existing = db.query(models.Application).filter(
        models.Application.job_id == application.job_id,
        models.Application.candidate_id == current_user.id
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="You have already applied."
        )

    new_application = models.Application(

        candidate_id=current_user.id,

        job_id=application.job_id

    )

    db.add(new_application)

    db.commit()

    db.refresh(new_application)

    return new_application


# =====================================================
# Upload Resume
# =====================================================

@router.post("/{application_id}/upload")
def upload_resume(

    application_id: int,

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    if current_user.role != "candidate":

        raise HTTPException(
            status_code=403,
            detail="Only candidates can upload resumes."
        )

    application = db.query(
        models.Application
    ).filter(
        models.Application.id == application_id
    ).first()

    if application is None:

        raise HTTPException(
            status_code=404,
            detail="Application not found."
        )

    if application.candidate_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Unauthorized."
        )

    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    upload_folder = "uploads"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    filename = file.filename.replace(" ", "_")

    file_path = os.path.join(
        upload_folder,
        filename
    )

    with open(file_path, "wb") as buffer:

        buffer.write(
            file.file.read()
        )

    # ---------------------------------------------------
    # Extract Resume Text
    # ---------------------------------------------------

    resume_text = extract_text_from_pdf(
        file_path
    )

    job = db.query(models.Job).filter(
        models.Job.id == application.job_id
    ).first()

    # ---------------------------------------------------
    # Same pipeline as the standalone Resume Analyzer:
    # LLM-based structured extraction -> fuzzy matching ->
    # weighted scoring. This keeps match_score meaning the
    # same thing everywhere in the app.
    # ---------------------------------------------------

    resume_data = extract_resume_information(
        resume_text
    )

    job_data = _build_job_data(job)

    scores = calculate_ats_score(
        resume_data,
        job_data
    )

    score = scores["ats_score"]

    application.resume_path = file_path

    application.match_score = score

    db.commit()

    db.refresh(application)

    # ---------------------------------------------------
    # Log this analysis for admin analytics, same as the
    # standalone analyzer. Wrapped so a logging failure
    # never blocks the candidate's upload.
    # ---------------------------------------------------

    try:

        analysis = generate_suggestions(resume_data, job_data)

        db.add(
            models.ResumeAnalysis(
                candidate_id=current_user.id,
                ats_score=score,
                missing_skills=json.dumps(
                    analysis["missing_skills"]
                )
            )
        )

        db.commit()

    except Exception as e:
        print(f"Failed to save resume analysis record: {e}")

    return {

        "message": "Resume uploaded successfully.",

        "resume_path": file_path,

        "match_score": score

    }


# =====================================================
# Candidate Applications
# =====================================================

@router.get(
    "/my",
    response_model=list[schemas.ApplicationResponse]
)
def my_applications(

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    if current_user.role != "candidate":

        raise HTTPException(
            status_code=403,
            detail="Only candidates."
        )

    return db.query(
        models.Application
    ).filter(
        models.Application.candidate_id == current_user.id
    ).all()


# =====================================================
# Recruiter View Applicants (ranked by match_score)
# =====================================================

@router.get(
    "/job/{job_id}",
    response_model=list[schemas.RecruiterApplicationResponse]
)
def get_applicants(

    job_id: int,

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    if current_user.role != "recruiter":

        raise HTTPException(
            status_code=403,
            detail="Only recruiters."
        )

    job = db.query(
        models.Job
    ).filter(
        models.Job.id == job_id
    ).first()

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    if job.posted_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Unauthorized."
        )

    # Ranking: highest match_score first. This is now
    # meaningful because match_score comes from the real
    # ATS scoring pipeline instead of a missing function.
    applications = db.query(
        models.Application
    ).filter(
        models.Application.job_id == job_id
    ).order_by(
        models.Application.match_score.desc()
    ).all()

    return applications


# =====================================================
# Recruiter: Detailed Applicant Analysis
# =====================================================

@router.get("/{application_id}/analysis")
def analyze_applicant(

    application_id: int,

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    if current_user.role != "recruiter":

        raise HTTPException(
            status_code=403,
            detail="Only recruiters."
        )

    application = db.query(
        models.Application
    ).filter(
        models.Application.id == application_id
    ).first()

    if application is None:

        raise HTTPException(
            status_code=404,
            detail="Application not found."
        )

    job = db.query(
        models.Job
    ).filter(
        models.Job.id == application.job_id
    ).first()

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    if job.posted_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Unauthorized."
        )

    if not application.resume_path:

        raise HTTPException(
            status_code=400,
            detail="This candidate has not uploaded a resume yet."
        )

    resume_text = extract_text_from_pdf(
        application.resume_path
    )

    resume_data = extract_resume_information(
        resume_text
    )

    job_data = _build_job_data(job)

    # TEMP DEBUG -- remove once the empty-score issue is resolved
    print("\n================ DEBUG: job.required_skills ================")
    print(repr(job.required_skills))
    print("\n================ DEBUG: resume_data ================")
    print(resume_data)
    print("\n================ DEBUG: job_data ================")
    print(job_data)

    scores = calculate_ats_score(
        resume_data,
        job_data
    )

    analysis = generate_suggestions(
        resume_data,
        job_data
    )

    # Keep the stored match_score in sync with this recomputation,
    # in case scoring logic has changed since the resume was
    # originally uploaded.
    application.match_score = scores["ats_score"]

    db.commit()

    return {

        "ats_score": scores["ats_score"],

        "section_scores": {

            "skills": scores["skills_score"],

            "education": scores["education_score"],

            "projects": scores["projects_score"],

            "certifications": scores["certifications_score"],

            "experience": scores["experience_score"],

        },

        "scored_categories": scores["scored_categories"],

        "resume_information": resume_data,

        "job_information": job_data,

        "matched_skills": analysis["matched_skills"],
        "missing_skills": analysis["missing_skills"],

        "matched_projects": analysis["matched_projects"],
        "missing_projects": analysis["missing_projects"],

        "matched_certifications": analysis["matched_certifications"],
        "missing_certifications": analysis["missing_certifications"],

        "suggestions": analysis["suggestions"]

    }


# =====================================================
# Update Status
# =====================================================

@router.put(
    "/{application_id}/status",
    response_model=schemas.StatusResponse
)
def update_status(

    application_id: int,

    status_update: schemas.ApplicationStatusUpdate,

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    if current_user.role != "recruiter":

        raise HTTPException(
            status_code=403,
            detail="Only recruiters."
        )

    application = db.query(
        models.Application
    ).filter(
        models.Application.id == application_id
    ).first()

    if application is None:

        raise HTTPException(
            status_code=404,
            detail="Application not found."
        )

    job = db.query(
        models.Job
    ).filter(
        models.Job.id == application.job_id
    ).first()

    if job.posted_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Unauthorized."
        )

    application.status = status_update.status

    db.commit()

    db.refresh(application)

    return {

        "message": "Application updated successfully.",

        "status": application.status

    }


# =====================================================
# Recruiter Analytics
# =====================================================

@router.get("/analytics")
def recruiter_analytics(

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    if current_user.role != "recruiter":

        raise HTTPException(
            status_code=403,
            detail="Only recruiters."
        )

    jobs = db.query(
        models.Job
    ).filter(
        models.Job.posted_by == current_user.id
    ).all()

    job_ids = [

        job.id

        for job in jobs

    ]

    applications = db.query(
        models.Application
    ).filter(
        models.Application.job_id.in_(job_ids)
    ).all()

    shortlisted = len([
        a for a in applications
        if a.status == "Shortlisted"
    ])

    rejected = len([
        a for a in applications
        if a.status == "Rejected"
    ])

    pending = len([
        a for a in applications
        if a.status == "Pending"
    ])

    average_score = 0

    if applications:

        average_score = round(

            sum(
                app.match_score
                for app in applications
            ) / len(applications),

            2

        )

    return {

        "jobs_posted": len(jobs),

        "applications": len(applications),

        "shortlisted": shortlisted,

        "rejected": rejected,

        "pending": pending,

        "average_score": average_score

    }