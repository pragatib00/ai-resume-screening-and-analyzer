from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get("/", response_model=list[schemas.JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).all()
    return jobs

@router.get(
    "/my",
    response_model=list[schemas.JobResponse]
)
def get_my_jobs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Only recruiters can view their jobs."
        )

    jobs = (
        db.query(models.Job)
        .filter(
            models.Job.posted_by == current_user.id
        )
        .all()
    )

    return jobs

@router.get("/{job_id}", response_model=schemas.JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(models.Job).filter(
        models.Job.id == job_id
    ).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job



@router.post("/", response_model=schemas.JobResponse)
def create_job(
    job: schemas.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only recruiters can create jobs
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Only recruiters can create jobs."
        )

    new_job = models.Job(
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=job.required_skills,
        location=job.location,
        posted_by=current_user.id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job

@router.put("/{job_id}", response_model=schemas.JobResponse)
def update_job(
    job_id: int,
    job: schemas.JobUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only recruiters can update jobs
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Only recruiters can update jobs."
        )

    db_job = db.query(models.Job).filter(
        models.Job.id == job_id
    ).first()

    if db_job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Only the recruiter who created the job can edit it
    if db_job.posted_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own jobs."
        )

    db_job.title = job.title
    db_job.company = job.company
    db_job.description = job.description
    db_job.required_skills = job.required_skills
    db_job.location = job.location

    db.commit()
    db.refresh(db_job)

    return db_job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only recruiters can delete jobs
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Only recruiters can delete jobs."
        )

    job = db.query(models.Job).filter(
        models.Job.id == job_id
    ).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Only the recruiter who created the job can delete it
    if job.posted_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own jobs."
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully."
    }