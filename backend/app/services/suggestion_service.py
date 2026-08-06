from app.services.fuzzy_match import token_set_ratio


# ==========================================================
# Find Matched and Missing Items
# ==========================================================

def get_matches(resume_items, job_items, threshold=80):

    matched = []
    missing = []

    for job in job_items:

        found = False

        for resume in resume_items:

            score = token_set_ratio(
                resume.lower(),
                job.lower()
            )

            if score >= threshold:

                matched.append(job)

                found = True
                break

        if not found:
            missing.append(job)

    return matched, missing


# ==========================================================
# Suggestions
# ==========================================================

def generate_suggestions(resume_data, job_data):

    matched_skills, missing_skills = get_matches(
        resume_data.get("skills", []),
        job_data.get("skills", []),
        threshold=80
    )

    matched_education, missing_education = get_matches(
        resume_data.get("education", []),
        job_data.get("education", []),
        threshold=70
    )

    suggestions = []

    # ------------------------------------------------------
    # Skills
    # ------------------------------------------------------

    if missing_skills:

        suggestions.append(
            "Consider adding or improving these skills: "
            + ", ".join(missing_skills)
        )

    # ------------------------------------------------------
    # Experience
    # ------------------------------------------------------

    candidate_exp = resume_data.get("experience_years", 0)
    required_exp = job_data.get("experience_years", 0)

    if required_exp > candidate_exp:

        suggestions.append(
            f"This job requires approximately {required_exp} years of experience, "
            f"but your resume shows {candidate_exp} years."
        )

    # ------------------------------------------------------
    # Education
    # ------------------------------------------------------

    if missing_education:

        suggestions.append(
            "Highlight relevant coursework or academic achievements that match the required education."
        )

    # ------------------------------------------------------
    # Final Suggestion
    # ------------------------------------------------------

    if not suggestions:

        suggestions.append(
            "Excellent match! Your resume aligns well with the job description."
        )

    return {

        "matched_skills": matched_skills,
        "missing_skills": missing_skills,

        "matched_education": matched_education,
        "missing_education": missing_education,

        "suggestions": suggestions

    }