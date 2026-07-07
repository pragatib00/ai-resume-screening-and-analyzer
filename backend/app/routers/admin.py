from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models, schemas
from app.auth import require_role

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# Roles an admin is allowed to assign to another user.
# Admin promotion is intentionally excluded from this route for now -
# promote the first admin manually in the database, then admins can
# only manage candidate/recruiter roles from here.
ASSIGNABLE_ROLES = {"candidate", "recruiter"}


# ---------------------------------------------------------
# User Management
# ---------------------------------------------------------

@router.get(
    "/users",
    response_model=list[schemas.UserResponse]
)
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return db.query(models.User).all()


@router.get(
    "/users/{user_id}",
    response_model=schemas.UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.patch(
    "/users/{user_id}/role",
    response_model=schemas.UserResponse
)
def update_user_role(
    user_id: int,
    role_update: schemas.UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    if role_update.role not in ASSIGNABLE_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"Role must be one of: {', '.join(ASSIGNABLE_ROLES)}."
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.role = role_update.role

    db.commit()
    db.refresh(user)

    return user


@router.patch(
    "/users/{user_id}/status",
    response_model=schemas.UserResponse
)
def update_user_status(
    user_id: int,
    status_update: schemas.UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    allowed_statuses = {"active", "suspended"}

    if status_update.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of: {', '.join(allowed_statuses)}."
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin accounts cannot be suspended."
        )

    user.status = status_update.status

    db.commit()
    db.refresh(user)

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own admin account."
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": f"User {user_id} deleted successfully."
    }


# ---------------------------------------------------------
# Job Oversight
# ---------------------------------------------------------

@router.get(
    "/jobs",
    response_model=list[schemas.JobResponse]
)
def list_all_jobs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return db.query(models.Job).all()


@router.delete("/jobs/{job_id}")
def delete_any_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    job = db.query(models.Job).filter(
        models.Job.id == job_id
    ).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {
        "message": f"Job {job_id} deleted successfully."
    }


# ---------------------------------------------------------
# Platform Analytics
# ---------------------------------------------------------

@router.get(
    "/analytics",
    response_model=schemas.AnalyticsResponse
)
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    import json
    from collections import Counter

    analyses = db.query(models.ResumeAnalysis).all()

    total_analyses = len(analyses)

    if total_analyses == 0:
        average_ats_score = 0
    else:
        average_ats_score = round(
            sum(a.ats_score for a in analyses) / total_analyses,
            2
        )

    skill_counter = Counter()

    for a in analyses:

        if not a.missing_skills:
            continue

        try:
            skills = json.loads(a.missing_skills)
        except Exception:
            continue

        skill_counter.update(skills)

    top_missing_skills = [
        {"skill": skill, "count": count}
        for skill, count in skill_counter.most_common(10)
    ]

    return schemas.AnalyticsResponse(
        total_analyses=total_analyses,
        average_ats_score=average_ats_score,
        top_missing_skills=top_missing_skills
    )


@router.get(
    "/logs",
    response_model=list[schemas.ErrorLogResponse]
)
def get_error_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return (
        db.query(models.ErrorLog)
        .order_by(models.ErrorLog.created_at.desc())
        .limit(limit)
        .all()
    )


@router.get(
    "/stats",
    response_model=schemas.PlatformStats
)
def get_platform_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    total_candidates = db.query(models.User).filter(
        models.User.role == "candidate"
    ).count()

    total_recruiters = db.query(models.User).filter(
        models.User.role == "recruiter"
    ).count()

    total_jobs = db.query(models.Job).count()

    total_applications = db.query(models.Application).count()

    avg_score = db.query(
        func.avg(models.Application.match_score)
    ).scalar()

    return schemas.PlatformStats(
        total_candidates=total_candidates,
        total_recruiters=total_recruiters,
        total_jobs=total_jobs,
        total_applications=total_applications,
        average_match_score=round(avg_score, 2) if avg_score else 0
    )