from app.services.tfidf_service import tfidf_similarity
from app.services.fuzzy_match import token_set_ratio


# ==========================================================
# Manual Fuzzy Matching
# ==========================================================

def fuzzy_similarity(
    resume_items,
    job_items,
    threshold=80
):
    if not job_items:
        return 100

    if not resume_items:
        return 0

    matched = 0

    for job in job_items:

        best = 0

        for resume in resume_items:

            score = token_set_ratio(
                resume,
                job
            )

            best = max(best, score)

        if best >= threshold:
            matched += 1

    return round(
        matched / len(job_items) * 100,
        2
    )


# ==========================================================
# Experience Score
# ==========================================================

def experience_score(candidate, required):

    if required == 0:
        return 100

    if candidate >= required:
        return 100

    return round(
        (candidate / required) * 100,
        2
    )


# ==========================================================
# Final ATS Score
# ==========================================================

def calculate_ats_score(
    resume_data,
    job_data
):

    # ------------------------------------------
    # TF-IDF Skill Similarity
    # ------------------------------------------

    resume_skill_text = " ".join(
        resume_data.get("skills", [])
    )

    job_skill_text = " ".join(
        job_data.get("skills", [])
    )

    tfidf_score = tfidf_similarity(
        resume_skill_text,
        job_skill_text
    )

    # ------------------------------------------
    # Fuzzy Skill Matching
    # ------------------------------------------

    fuzzy_skill_score = fuzzy_similarity(
        resume_data.get("skills", []),
        job_data.get("skills", []),
        threshold=80
    )

    # ------------------------------------------
    # Blend TF-IDF + Fuzzy
    # TF-IDF has higher importance
    # ------------------------------------------

    skills_score = round(
        tfidf_score * 0.70 +
        fuzzy_skill_score * 0.30,
        2
    )

    # ------------------------------------------
    # Education
    # ------------------------------------------

    education_score = fuzzy_similarity(
        resume_data.get("education", []),
        job_data.get("education", []),
        threshold=70
    )

    # ------------------------------------------
    # Experience
    # ------------------------------------------

    experience = experience_score(
        resume_data.get("experience_years", 0),
        job_data.get("experience_years", 0)
    )

    # ------------------------------------------
    # Final ATS Score
    # ------------------------------------------

    ats = (
        skills_score * 0.50 +
        education_score * 0.20 +
        experience * 0.30
    )

    # ------------------------------------------
    # Return all scores
    # ------------------------------------------

    return {
        "ats_score": round(ats, 2),

        "skills_score": round(
            skills_score,
            2
        ),

        "education_score": round(
            education_score,
            2
        ),

        "experience_score": round(
            experience,
            2
        ),

        "scored_categories": [
            "skills",
            "education",
            "experience"
        ]
    }