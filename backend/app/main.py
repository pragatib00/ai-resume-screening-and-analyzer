from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

from app.routers import (
    users,
    jobs,
    applications,
    resume_analyzer,
    admin,
    contact,
    notifications
)

Base.metadata.create_all(bind=engine)

# Create app FIRST
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
     allow_methods=["*"],
    allow_headers=["*"],
)

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
app.include_router(contact.router)
app.include_router(notifications.router)

@app.get("/")
def home():
    return {
        "message": "Database connected successfully!"
    }
