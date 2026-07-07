from rapidfuzz import fuzz


# ---------------------------------------------------------
# Generic Fuzzy Similarity
# ---------------------------------------------------------

def fuzzy_similarity(resume_items, job_items, threshold=80):

    if not job_items:
        return 100

    if not resume_items:
        return 0

    matched = 0

    for job in job_items:

        best = 0

        for resume in resume_items:

            score = fuzz.token_set_ratio(
                resume.lower(),
                job.lower()
            )

            if score > best:
                best = score

        if best >= threshold:
            matched += 1

    return round(
        matched / len(job_items) * 100,
        2
    )


# ---------------------------------------------------------
# Experience
# ---------------------------------------------------------

def experience_score(candidate, required):

    if required == 0:
        return 100

    if candidate >= required:
        return 100

    return round(
        (candidate / required) * 100,
        2
    )


# ---------------------------------------------------------
# ATS Score
# ---------------------------------------------------------

def calculate_ats_score(resume_data, job_data):

    skills = fuzzy_similarity(
        resume_data.get("skills", []),
        job_data.get("skills", []),
        threshold=80
    )

    education = fuzzy_similarity(
       resume_data.get("education", []),
       job_data.get("education", []),
       threshold=70
    )

    projects = fuzzy_similarity(
        resume_data.get("projects", []),
        job_data.get("projects", []),
        threshold=75
    )

    certifications = fuzzy_similarity(
        resume_data.get("certifications", []),
        job_data.get("certifications", []),
        threshold=80
    )

    experience = experience_score(
        resume_data.get("experience_years", 0),
        job_data.get("experience_years", 0)
    )

    weights = {
        "skills": 0.40,
        "education": 0.15,
        "projects": 0.15,
        "certifications": 0.10,
        "experience": 0.20
    }

    ats = (
        skills * weights["skills"] +
        education * weights["education"] +
        projects * weights["projects"] +
        certifications * weights["certifications"] +
        experience * weights["experience"]
    )

    return {

        "ats_score": round(ats, 2),

        "skills_score": round(skills, 2),

        "education_score": round(education, 2),

        "projects_score": round(projects, 2),

        "certifications_score": round(certifications, 2),

        "experience_score": round(experience, 2)
    }