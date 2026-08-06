import math
from collections import Counter


# ----------------------------------------------------
# Tokenize
# ----------------------------------------------------

def tokenize(text):

    return text.lower().split()


# ----------------------------------------------------
# TF
# ----------------------------------------------------

def term_frequency(tokens):

    tf = {}

    total = len(tokens)

    counts = Counter(tokens)

    for word, count in counts.items():

        tf[word] = count / total

    return tf


# ----------------------------------------------------
# IDF
# ----------------------------------------------------

def inverse_document_frequency(documents):

    N = len(documents)

    idf = {}

    vocabulary = set()

    for doc in documents:

        vocabulary.update(doc)

    for word in vocabulary:

        containing = 0

        for doc in documents:

            if word in doc:

                containing += 1

        idf[word] = math.log((N + 1) / (containing + 1)) + 1

    return idf


# ----------------------------------------------------
# TF-IDF Vector
# ----------------------------------------------------

def tfidf_vector(tokens, idf):

    tf = term_frequency(tokens)

    vector = {}

    for word in idf:

        vector[word] = tf.get(word, 0) * idf[word]

    return vector


# ----------------------------------------------------
# Cosine Similarity
# ----------------------------------------------------

def cosine_similarity(v1, v2):

    dot = 0

    for word in v1:

        dot += v1[word] * v2[word]

    norm1 = math.sqrt(sum(value ** 2 for value in v1.values()))
    norm2 = math.sqrt(sum(value ** 2 for value in v2.values()))

    if norm1 == 0 or norm2 == 0:

        return 0

    return dot / (norm1 * norm2)


# ----------------------------------------------------
# Final Similarity
# ----------------------------------------------------

def tfidf_similarity(resume_text, job_text):

    resume_tokens = tokenize(resume_text)

    job_tokens = tokenize(job_text)

    idf = inverse_document_frequency(
        [resume_tokens, job_tokens]
    )

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