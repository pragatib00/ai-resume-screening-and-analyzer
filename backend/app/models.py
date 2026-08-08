print("models.py loaded")

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func as sql_func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default="active")
    # status values: "active", "pending", "suspended"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(100), nullable=False)
    company = Column(String(100), nullable=False)
    description = Column(String, nullable=False)
    required_skills = Column(String, nullable=False)
    location = Column(String(100), nullable=False)

    posted_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    recruiter = relationship("User")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    resume_path = Column(
        String,
        nullable=True
    )

    match_score = Column(
        Float,
        default=0
    )

    status = Column(
        String(20),
        default="Pending"
    )

    candidate = relationship("User")
    job = relationship("Job")


class ErrorLog(Base):
    __tablename__ = "error_logs"

    id = Column(Integer, primary_key=True, index=True)

    source = Column(String(100), nullable=False)
    # e.g. "extract_list", "extract_integer"

    message = Column(String, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=sql_func.now()
    )


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    message = Column(String, nullable=False)

    is_read = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=sql_func.now()
    )


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    type = Column(String(30), nullable=False)
    # e.g. "new_applicant", "status_change"

    message = Column(String, nullable=False)

    link = Column(String, nullable=True)
    # frontend route to navigate to when clicked

    is_read = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=sql_func.now()
    )

    user = relationship("User")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    ats_score = Column(Float, nullable=False)

    missing_skills = Column(String, nullable=True)
    # stored as a JSON-encoded list, e.g. '["SQL", "AWS"]'

    full_result = Column(String, nullable=True)
    # stored as a JSON-encoded ResumeAnalysisResponse, used to reopen past analyses

    created_at = Column(
        DateTime(timezone=True),
        server_default=sql_func.now()
    )

    candidate = relationship("User")