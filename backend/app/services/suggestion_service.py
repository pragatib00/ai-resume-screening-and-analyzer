from app.services.fuzzy_match import token_set_ratio


# ==========================================================
# Generic Fuzzy Matching
# ==========================================================

def get_matches(resume_items, job_items, threshold=80):

    matched = []
    missing = []

    for job in job_items:

        found = False

        for resume in resume_items:

            score = token_set_ratio(
                resume,
                job
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
# Focused on Skills, Education, and Experience only - Projects
# and Certifications are intentionally not matched or suggested on.

def generate_suggestions(resume_data, job_data):

    matched_skills, missing_skills = get_matches(
        resume_data["skills"],
        job_data["skills"],
        threshold=80
    )

    matched_education, missing_education = get_matches(
        resume_data["education"],
        job_data["education"],
        threshold=70
    )

    suggestions = []

    if missing_skills:
        suggestions.append(
            "Consider adding or highlighting these skills: "
            + ", ".join(missing_skills) + "."
        )

    candidate_exp = resume_data["experience_years"]
    required_exp = job_data["experience_years"]

    if required_exp > candidate_exp:
        suggestions.append(
            f"The job requires approximately {required_exp} years of experience, but your resume shows {candidate_exp} years."
        )

    if missing_education:
        suggestions.append(
            "Your educational background is related, but make sure to highlight relevant coursework or academic achievements."
        )

    if not suggestions:
        suggestions.append(
            "Excellent match! Your resume aligns well with this job description."
        )

    return {

        "matched_skills": matched_skills,
        "missing_skills": missing_skills,

        "matched_education": matched_education,
        "missing_education": missing_education,

        "suggestions": suggestions

    }