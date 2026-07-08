from rapidfuzz import fuzz


# ---------------------------------------------------------
# Generic Fuzzy Similarity
# ---------------------------------------------------------

def fuzzy_similarity(resume_items, job_items, threshold=80):
    """
    NOTE: caller is responsible for only invoking this when
    job_items is non-empty. An empty job_items list no longer
    means "perfect match" -- see calculate_ats_score, which
    excludes categories with no extracted job requirements
    instead of crediting them automatically.
    """

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
    """
    Only categories where the job side has actual extracted
    requirements are included in the weighted score. This
    avoids the old behavior of silently crediting 100% for
    any category the LLM failed to extract from the job
    description (which was making every resume score ~100%
    whenever job extraction came back empty).

    If NOTHING could be reliably extracted from the job
    description, we return an ats_score of 0 rather than 100,
    since an unparseable job description should never read as
    "perfect match" -- it should surface as something to
    investigate.
    """

    weights = {
        "skills": 0.40,
        "education": 0.15,
        "projects": 0.15,
        "certifications": 0.10,
        "experience": 0.20
    }

    thresholds = {
        "skills": 80,
        "education": 70,
        "projects": 75,
        "certifications": 80
    }

    raw_scores = {}
    active_weights = {}

    for category, threshold in thresholds.items():

        job_items = job_data.get(category, [])

        if job_items:

            raw_scores[category] = fuzzy_similarity(
                resume_data.get(category, []),
                job_items,
                threshold=threshold
            )

            active_weights[category] = weights[category]

    required_exp = job_data.get("experience_years", 0)

    if required_exp > 0:

        raw_scores["experience"] = experience_score(
            resume_data.get("experience_years", 0),
            required_exp
        )

        active_weights["experience"] = weights["experience"]

    if not active_weights:

        return {
            "ats_score": 0,
            "skills_score": raw_scores.get("skills", 0),
            "education_score": raw_scores.get("education", 0),
            "projects_score": raw_scores.get("projects", 0),
            "certifications_score": raw_scores.get("certifications", 0),
            "experience_score": raw_scores.get("experience", 0),
            "scored_categories": []
        }

    total_weight = sum(active_weights.values())

    ats = sum(
        raw_scores[category] * (weight / total_weight)
        for category, weight in active_weights.items()
    )

    return {

        "ats_score": round(ats, 2),

        "skills_score": round(raw_scores.get("skills", 0), 2),

        "education_score": round(raw_scores.get("education", 0), 2),

        "projects_score": round(raw_scores.get("projects", 0), 2),

        "certifications_score": round(raw_scores.get("certifications", 0), 2),

        "experience_score": round(raw_scores.get("experience", 0), 2),

        # exposed so the UI can show *why* a category was skipped
        # (e.g. "no certifications required, or none detected")
        "scored_categories": list(active_weights.keys())
    }