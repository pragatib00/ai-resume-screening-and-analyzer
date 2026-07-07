# AI Resume Screening and Analyzer

## Overview

AI Resume Screening and Analyzer is an intelligent Applicant Tracking System (ATS) designed to evaluate resumes against a given job description. The system uses a Large Language Model (LLM) to extract structured information from resumes and job descriptions, then applies fuzzy matching and a weighted scoring formula to calculate an ATS compatibility score.

The application helps recruiters quickly identify suitable candidates while providing applicants with personalized feedback to improve their resumes.

---

## Features

* Upload resumes in PDF format
* AI-powered resume and job description parsing using Ollama (Llama 3.2)
* ATS score calculation based on multiple resume sections
  * Skills
  * Education
  * Projects
  * Certifications
  * Experience
* Identify matching skills, projects, and certifications
* Identify missing requirements
* Generate personalized improvement suggestions
* Interactive Streamlit frontend
* FastAPI backend REST API

---

## Tech Stack

### Frontend
* Streamlit

### Backend
* FastAPI
* Python

### AI Model
* Ollama
* Llama 3.2 (3B)

### Matching & Scoring
* RapidFuzz (fuzzy string matching, `token_set_ratio`)
* Custom weighted scoring formula

### Database
* SQLAlchemy ORM (SQLite for development, PostgreSQL-ready via `DATABASE_URL`)

### PDF Processing
* PyMuPDF (fitz)

---

## Project Structure

```text
AI-Resume-Screening/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── users.py
│   │   │   ├── jobs.py
│   │   │   ├── applications.py
│   │   │   ├── resume_analyzer.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── pdf_service.py
│   │   │   ├── llm_service.py
│   │   │   ├── scoring_service.py
│   │   │   └── suggestion_service.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── auth.py
│   ├── uploads/
│   ├── venv/
│   └── .env
│
├── frontend/
│   ├── admin/
│   │   ├── dashboard.py
│   │   └── profile.py
│   ├── candidate/
│   │   ├── dashboard.py
│   │   ├── browse_jobs.py
│   │   ├── my_applications.py
│   │   ├── resume_analyzer.py
│   │   └── profile.py
│   ├── recruiter/
│   │   ├── dashboard.py
│   │   ├── create_job.py
│   │   ├── my_jobs.py
│   │   ├── applicants.py
│   │   └── profile.py
│   ├── auth/
│   │   ├── login_page.py
│   │   └── register_page.py
│   ├── utils/
│   ├── assets/
│   ├── venv/
│   ├── api.py
│   └── app.py
│
├── .gitignore
├── README.md
└── requirements.txt
```

---

## Setup

### Prerequisites
* Python 3.10+
* Ollama installed locally

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd AI-Resume-Screening

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=sqlite:///./resume_screening.db
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_SECRET_KEY=your-admin-registration-secret
```

Run the backend:

```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000` (interactive docs at `/docs`).

### 2. Set up Ollama

```bash
ollama pull llama3.2:3b
ollama serve
```

Leave `ollama serve` running in the background, the backend calls it at `http://localhost:11434` for resume/job text extraction.

### 3. Run the frontend

```bash
cd frontend
streamlit run app.py
```

---

## Roles & Access

| Role | How it's created |
|---|---|
| Candidate | Self-registers via the app - active immediately |
| Recruiter | Self-registers via the app - pending admin approval before first login |
| Admin | Registers via the app using the correct `ADMIN_SECRET_KEY` - active immediately |

An admin can promote/demote users between candidate and recruiter, approve pending recruiters, and suspend/reactivate any non-admin account.

---

## How Resume Scoring Works

1. **Extraction** :  Ollama (`llama3.2:3b`) extracts structured data (skills, education, projects, certifications, years of experience) from both the resume and the job description.
2. **Matching** : Skills, education, projects, and certifications are compared using fuzzy string matching (RapidFuzz); experience is compared numerically.
3. **Weighted scoring** : Section scores are combined into a final ATS score:

   | Section | Weight |
   |---|---|
   | Skills | 40% |
   | Experience | 20% |
   | Education | 15% |
   | Projects | 15% |
   | Certifications | 10% |

4. **Suggestions** :  Missing skills, projects, certifications, and experience gaps are turned into plain-language suggestions for the candidate.

---

## Notes

* This project uses a locally-hosted LLM (Ollama), so no external API keys or costs are involved for the AI extraction step.
* `ADMIN_SECRET_KEY` should be kept private and out of version control (`.env` is gitignored).
* For production use, consider moving from SQLite to PostgreSQL and adding token revocation/refresh handling.

---

### About This Project

This was originally built as a group project as part of the Bachelor of Science in Computer Science and Information Technology (BSc. CSIT) program.

Team members: Pragati Basnet, Orisha Shakya, Pragati Lama

This repository is maintained on my personal GitHub.

---

## License

This project is intended for educational and learning purposes.