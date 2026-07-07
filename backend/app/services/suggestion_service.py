from rapidfuzz import fuzz


# ==========================================================
# Generic Fuzzy Matching
# ==========================================================

def get_matches(resume_items, job_items, threshold=80):

    matched = []
    missing = []

    for job in job_items:

        found = False

        for resume in resume_items:

            score = fuzz.token_set_ratio(
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
        resume_data["skills"],
        job_data["skills"],
        threshold=80
    )

    matched_projects, missing_projects = get_matches(
        resume_data["projects"],
        job_data["projects"],
        threshold=75
    )

    matched_certifications, missing_certifications = get_matches(
        resume_data["certifications"],
        job_data["certifications"],
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

    if missing_projects:
        suggestions.append(
            "Consider showcasing projects related to: "
            + ", ".join(missing_projects) + "."
        )

    if missing_certifications:
        suggestions.append(
            "Relevant certifications that may strengthen your profile: "
            + ", ".join(missing_certifications) + "."
        )

    candidate_exp = resume_data["experience_years"]
    required_exp = job_data["experience_years"]

    if required_exp > candidate_exp:
        suggestions.append(
            f"The job requires approximately {required_exp} years of experience, but your resume shows {candidate_exp} years."
        )

    if missing_education:
        suggestions.append(
            "Your educational background is related, but make sure to highlight relevant coursework, academic projects, or certifications."
        )

    if not suggestions:
        suggestions.append(
            "Excellent match! Your resume aligns well with this job description."
        )

    return {

        "matched_skills": matched_skills,
        "missing_skills": missing_skills,

        "matched_projects": matched_projects,
        "missing_projects": missing_projects,

        "matched_certifications": matched_certifications,
        "missing_certifications": missing_certifications,

        "suggestions": suggestions

    }