from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session

from app import schemas, models
from app.database import get_db
from app.auth import get_current_user

import json
import tempfile
import os

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
    prefix="/resume",
    tags=["Resume Analyzer"]
)


@router.post(
    "/analyze",
    response_model=schemas.ResumeAnalysisResponse
)
def analyze_resume(

    file: UploadFile = File(...),

    job_description: str = Form(...),

    db: Session = Depends(get_db),

    current_user: models.User = Depends(get_current_user)

):

    # ---------------------------------------------------
    # Validate PDF
    # ---------------------------------------------------

    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # ---------------------------------------------------
    # Save PDF temporarily
    # ---------------------------------------------------

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as tmp:

        tmp.write(file.file.read())

        pdf_path = tmp.name

    try:

        # ---------------------------------------------------
        # Extract Resume Text
        # ---------------------------------------------------

        resume_text = extract_text_from_pdf(
            pdf_path
        )

    finally:

        os.remove(pdf_path)

    # ---------------------------------------------------
    # LLM Extraction
    # ---------------------------------------------------

    resume_data = extract_resume_information(
        resume_text
    )

    job_data = extract_job_information(
        job_description
    )

    print("\n================ RESUME DATA ================")
    print(resume_data)

    print("\n================ JOB DATA ================")
    print(job_data)

    # ---------------------------------------------------
    # Calculate ATS Score
    # ---------------------------------------------------

    scores = calculate_ats_score(
        resume_data=resume_data,
        job_data=job_data,
        
    )

    # ---------------------------------------------------
    # Suggestions
    # ---------------------------------------------------

    analysis = generate_suggestions(
        resume_data,
        job_data
    )

    # ---------------------------------------------------
    # Response
    # ---------------------------------------------------

    result = {

        "ats_score": scores["ats_score"],

        "section_scores": {

            "skills": scores["skills_score"],

            "education": scores["education_score"],

            "experience": scores["experience_score"]

        },

        "resume_information": resume_data,

        "job_information": job_data,

        "matched_skills": analysis["matched_skills"],

        "missing_skills": analysis["missing_skills"],

        "matched_education": analysis["matched_education"],

        "missing_education": analysis["missing_education"],

        "suggestions": analysis["suggestions"]

    }

    # ---------------------------------------------------
    # Save Analysis
    # ---------------------------------------------------

    try:

        db.add(
            models.ResumeAnalysis(
                candidate_id=current_user.id,
                ats_score=scores["ats_score"],
                missing_skills=json.dumps(
                    analysis["missing_skills"]
                ),
                full_result=json.dumps(result)
            )
        )

        db.commit()

    except Exception as e:
        print(f"Failed to save resume analysis record: {e}")

    return result


@router.get(
    "/history",
    response_model=list[schemas.ResumeHistoryItem]
)
def get_resume_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    records = (
        db.query(models.ResumeAnalysis)
        .filter(models.ResumeAnalysis.candidate_id == current_user.id)
        .order_by(models.ResumeAnalysis.created_at.desc())
        .all()
    )

    return [
        schemas.ResumeHistoryItem(
            id=record.id,
            ats_score=record.ats_score,
            created_at=record.created_at,
            has_details=bool(record.full_result)
        )
        for record in records
    ]


@router.get(
    "/history/{analysis_id}",
    response_model=schemas.ResumeAnalysisResponse
)
def get_resume_history_detail(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    record = db.query(models.ResumeAnalysis).filter(
        models.ResumeAnalysis.id == analysis_id,
        models.ResumeAnalysis.candidate_id == current_user.id
    ).first()

    if record is None or not record.full_result:
        raise HTTPException(
            status_code=404,
            detail="Analysis details not found."
        )

    return json.loads(record.full_result)