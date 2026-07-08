import json
import re
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:3b"


def query_llm(prompt):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        }
    )

    response.raise_for_status()

    return response.json()["response"]

def flatten_items(items):
    """
    Safety net: some LLM responses group items under a category
    label instead of listing them individually, e.g.
    "Programming: Python(NumPy, Pandas)" instead of separate
    "Python", "NumPy", "Pandas" entries. This breaks fuzzy
    token matching downstream, so we split those apart here.
    """

    flattened = []

    for item in items:

        if not isinstance(item, str):
            continue

        # Drop a leading "Category:" label if present
        if ":" in item:
            item = item.split(":", 1)[1]

        # Split on common separators used to group items together
        for piece in re.split(r"[,\(\)/]", item):

            piece = piece.strip()

            if piece:
                flattened.append(piece)

    return flattened


def extract_list(text, instruction, retries=1):

    prompt = f"""
You are an ATS parser.

{text}

{instruction}

Rules:
- Return ONLY a flat JSON array of individual items.
- Do NOT group items under a category label (e.g. do NOT write "Programming: Python, NumPy").
- Do NOT combine multiple items into one string.
- Each item must be a single, standalone value with no parentheses, colons, or commas inside it.

Example:

[
    "Python",
    "SQL",
    "Machine Learning"
]
"""

    last_error = None

    # An empty result from a single LLM call is ambiguous: it could
    # genuinely mean "no items", or it could mean the model produced
    # unparseable output. We retry a couple of times before accepting
    # an empty result, and log clearly when we give up, so a silent
    # extraction failure doesn't get treated as "requirement met" by
    # the scoring layer.
    for attempt in range(retries + 1):

        try:
            response = query_llm(prompt)

            start = response.find("[")
            end = response.rfind("]") + 1

            if start == -1 or end <= start:
                raise ValueError(f"No JSON array found in LLM response: {response!r}")

            raw_items = json.loads(response[start:end])

            items = flatten_items(raw_items)

            if items:
                return items

            # Empty but technically valid JSON -- retry before accepting it
            last_error = "LLM returned an empty array"

        except Exception as e:
            last_error = e

    print(
        f"extract_list: giving up after {retries + 1} attempt(s), "
        f"returning empty list. Last error: {last_error}"
    )

    return []

def extract_integer(text, instruction, retries=1):

    prompt = f"""
{text}

{instruction}

Return ONLY one integer.

Example:

2
"""

    last_error = None

    for attempt in range(retries + 1):

        try:
            response = query_llm(prompt)

            match = re.search(r"\d+", response)

            if match:
                return int(match.group())

            last_error = f"No integer found in LLM response: {response!r}"

        except Exception as e:
            last_error = e

    print(
        f"extract_integer: giving up after {retries + 1} attempt(s), "
        f"returning 0. Last error: {last_error}"
    )

    return 0

def extract_resume_information(text):

    return {

        "skills": extract_list(
            text,
            "Extract ONLY technical skills. Ignore soft skills."
        ),

        "education": extract_list(
            text,
            "Extract ONLY degree names."
        ),

        "projects": extract_list(
            text,
            "Extract ONLY project titles."
        ),

        "certifications": extract_list(
            text,
            "Extract ONLY certification names."
        ),

        "experience_years": extract_integer(
            text,
            "How many years of professional experience does this resume show?"
        )

    }

def extract_job_information(text):

    return {

        "skills": extract_list(
            text,
            "Extract ONLY required technical skills."
        ),

        "education": extract_list(
            text,
            "Extract ONLY required degree names."
        ),

        "projects": extract_list(
            text,
            "Extract ONLY required project types if mentioned."
        ),

        "certifications": extract_list(
            text,
            "Extract ONLY required certifications."
        ),

        "experience_years": extract_integer(
            text,
            "How many years of experience are required?"
        )

    }