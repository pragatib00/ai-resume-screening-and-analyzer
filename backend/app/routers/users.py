from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_db
from app import models, schemas

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

from app.config import ADMIN_SECRET_KEY

router = APIRouter()

# Roles that are allowed to self-register through the public endpoint.
PUBLIC_REGISTRATION_ROLES = {"candidate", "recruiter", "admin"}


@router.get("/")
def test():
    return {
        "message": "Users router is working!"
    }


@router.post(
    "/register",
    response_model=schemas.UserResponse
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    if user.role not in PUBLIC_REGISTRATION_ROLES:
        raise HTTPException(
            status_code=400,
            detail="Role must be 'candidate', 'recruiter', or 'admin'."
        )

    if user.role == "admin":

        if not ADMIN_SECRET_KEY:
            raise HTTPException(
                status_code=500,
                detail="Admin registration is not configured."
            )

        if user.admin_secret != ADMIN_SECRET_KEY:
            raise HTTPException(
                status_code=403,
                detail="Invalid admin secret key."
            )

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Candidates and admins are active immediately.
    # Recruiters need admin approval before they can log in and post jobs.
    initial_status = "pending" if user.role == "recruiter" else "active"

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        status=initial_status
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find user by email (username contains the email)
    db_user = db.query(models.User).filter(
        models.User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if db_user.status == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your account is awaiting admin approval."
        )

    if db_user.status == "suspended":
        raise HTTPException(
            status_code=403,
            detail="Your account has been suspended. Contact support."
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "status": current_user.status
    }