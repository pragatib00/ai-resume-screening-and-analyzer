from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    admin_secret: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )

class UserRoleUpdate(BaseModel):
    role: str

class UserStatusUpdate(BaseModel):
    status: str

class CandidateInfo(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(
        from_attributes=True
    )


class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    required_skills: str
    location: str


class JobResponse(JobCreate):
    id: int
    posted_by: int

    model_config = ConfigDict(
        from_attributes=True
    )

class JobInfo(BaseModel):
    id: int
    title: str
    company: str
    location: str

    model_config = ConfigDict(
        from_attributes=True
    )

class JobUpdate(BaseModel):
    title: str
    company: str
    description: str
    required_skills: str
    location: str

class RecruiterApplicationResponse(BaseModel):
    id: int
    candidate: CandidateInfo
    job: JobInfo
    resume_path: str | None = None
    match_score: float
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )

class ApplicationCreate(BaseModel):
    job_id: int



class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job: JobResponse
    resume_path: str | None = None
    match_score: float
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )

class ApplicantResponse(BaseModel):
    candidate_name: str
    candidate_email: str
    match_score: float
    status: str
    resume_path: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )

class ApplicationStatusUpdate(BaseModel):
    status: str


class StatusResponse(BaseModel):
    message: str
    status: str

# ---------------------------------------------------------
# Resume Analysis - Skills, Education, and Experience only.
# Projects and Certifications are intentionally excluded.
# ---------------------------------------------------------

class SectionScores(BaseModel):

    skills: float

    education: float

    experience: float


class ResumeInformation(BaseModel):

    skills: list[str]

    education: list[str]

    experience_years: int


class JobInformation(BaseModel):

    skills: list[str]

    education: list[str]

    experience_years: int


class ResumeAnalysisResponse(BaseModel):

    ats_score: float

    section_scores: SectionScores

    resume_information: ResumeInformation

    job_information: JobInformation

    matched_skills: list[str]

    missing_skills: list[str]

    matched_education: list[str]

    missing_education: list[str]

    suggestions: list[str]

class PlatformStats(BaseModel):
    total_candidates: int
    total_recruiters: int
    total_jobs: int
    total_applications: int
    average_match_score: float

class ErrorLogResponse(BaseModel):
    id: int
    source: str
    message: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class MissingSkillCount(BaseModel):
    skill: str
    count: int


class AnalyticsResponse(BaseModel):
    total_analyses: int
    average_ats_score: float
    top_missing_skills: list[MissingSkillCount]