from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
from app import models

from app.routers import (
    users,
    jobs,
    applications,
    resume_analyzer,
    admin
)

Base.metadata.create_all(bind=engine)

# Create app FIRST
app = FastAPI()

# Mount uploads
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(resume_analyzer.router)
app.include_router(admin.router)

@app.get("/")
def home():
    return {
        "message": "Database connected successfully!"
    }