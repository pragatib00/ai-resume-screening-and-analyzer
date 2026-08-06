import math
import re
from collections import Counter

from app.services.fuzzy_match import token_set_ratio


# ==========================================================
# Text Preprocessing
# ==========================================================

def preprocess(text):

    text = text.lower()

    return re.findall(r"[a-z0-9]+", text)


# ==========================================================
# Manual TF
# ==========================================================

def term_frequency(tokens):

    total = len(tokens)

    if total == 0:
        return {}

    counts = Counter(tokens)

    tf = {}

    for word, count in counts.items():
        tf[word] = count / total

    return tf


# ==========================================================
# Manual IDF
# ==========================================================

def inverse_document_frequency(documents):

    N = len(documents)

    vocabulary = set()

    for doc in documents:
        vocabulary.update(doc)

    idf = {}

    for word in vocabulary:

        containing = sum(
            1 for doc in documents if word in doc
        )

        idf[word] = math.log((N + 1) / (containing + 1)) + 1

    return idf


# ==========================================================
# TF-IDF Vector
# ==========================================================

def tfidf_vector(tokens, idf):

    tf = term_frequency(tokens)

    vector = {}

    for word in idf:

        vector[word] = tf.get(word, 0) * idf[word]

    return vector


# ==========================================================
# Manual Cosine Similarity
# ==========================================================

def cosine_similarity(v1, v2):

    words = set(v1.keys()) | set(v2.keys())

    dot = 0
    norm1 = 0
    norm2 = 0

    for word in words:

        a = v1.get(word, 0)
        b = v2.get(word, 0)

        dot += a * b

        norm1 += a * a
        norm2 += b * b

    if norm1 == 0 or norm2 == 0:
        return 0

    return dot / (math.sqrt(norm1) * math.sqrt(norm2))


# ==========================================================
# TF-IDF Similarity
# ==========================================================

def tfidf_similarity(resume_text, job_text):

    resume_tokens = preprocess(resume_text)
    job_tokens = preprocess(job_text)

    if not resume_tokens or not job_tokens:
        return 0

    idf = inverse_document_frequency([
        resume_tokens,
        job_tokens
    ])

    resume_vector = tfidf_vector(
        resume_tokens,
        idf
    )

    job_vector = tfidf_vector(
        job_tokens,
        idf
    )

    similarity = cosine_similarity(
        resume_vector,
        job_vector
    )

    return round(similarity * 100, 2)


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
    # Fuzzy Skill Matching (for reporting)
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

    return {

        "ats_score": round(ats, 2),

        "skills_score": round(skills_score, 2),

        "education_score": round(education_score, 2),

        "experience_score": round(experience, 2),

        "tfidf_score": round(tfidf_score, 2),

        "fuzzy_skill_score": round(fuzzy_skill_score, 2),

        "scored_categories": [
            "skills",
            "education",
            "experience"
        ]

    }