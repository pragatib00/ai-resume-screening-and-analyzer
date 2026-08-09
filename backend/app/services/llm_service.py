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
            "stream": False,
            "options": {
                "temperature": 0,
                "num_predict": 300
            },
            "keep_alive": "10m"
        },
        timeout=120
    )

    response.raise_for_status()

    return response.json()["response"]


def flatten_items(items):

    flattened = []

    for item in items:

        if not isinstance(item, str):
            continue

        if ":" in item:
            item = item.split(":", 1)[1]

        for piece in re.split(r"[,\(\)/]", item):

            piece = piece.strip()

            if piece:
                flattened.append(piece)

    # Remove duplicates while preserving order
    seen = set()
    result = []

    for item in flattened:

        key = item.lower()

        if key not in seen:
            seen.add(key)
            result.append(item)

    return result


def parse_json_object(response):

    """
    Extract the JSON object from the LLM response.
    """

    start = response.find("{")
    end = response.rfind("}") + 1

    if start == -1 or end <= start:
        raise ValueError("No JSON object found.")

    return json.loads(response[start:end])


def extract_structured_information(text, mode="resume", retries=1):

    if mode == "resume":

        task = """
Extract the following information from the resume:

1. skills:
   Extract ALL technical skills.

   Include:
   - Programming Languages
   - Libraries
   - Frameworks
   - Databases
   - Developer Tools
   - Cloud Platforms
   - Technologies
   - APIs

   Do NOT include soft skills.

2. education:
   Extract ONLY degree names.

   Examples:
   - B.Sc. in Computer Science
   - B.E. Software Engineering
   - M.Sc. Data Science

3. experience_years:
   Estimate the total number of years of professional work experience.

"""

    else:

        task = """
Extract the following information from the job description:

1. skills:
   Extract ALL required technical skills.

   Include:
   - Programming Languages
   - Libraries
   - Frameworks
   - Databases
   - Developer Tools
   - Cloud Platforms
   - Technologies
   - APIs

   Do NOT include soft skills.

2. education:
   Extract ONLY required degree names.

3. experience_years:
   Extract the number of years of professional experience required.

"""

    prompt = f"""
You are an expert ATS information extraction system.

{text}

{task}

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not provide explanations.
3. Every skill must be an individual item.
4. Remove duplicate skills.
5. Do not combine multiple skills into one item.
6. Do not omit programming languages.
7. If information is not available, return an empty list or 0.

Return EXACTLY this structure:

{{
    "skills": [],
    "education": [],
    "experience_years": 0
}}
"""

    last_error = None

    for attempt in range(retries + 1):

        try:

            response = query_llm(prompt)

            data = parse_json_object(response)

            skills = data.get("skills", [])
            education = data.get("education", [])
            experience_years = data.get(
                "experience_years",
                0
            )

            # Make sure lists are actually lists
            if not isinstance(skills, list):
                skills = []

            if not isinstance(education, list):
                education = []

            # Clean extracted items
            skills = flatten_items(skills)
            education = flatten_items(education)

            # Make sure experience is an integer
            if isinstance(experience_years, str):

                match = re.search(
                    r"\d+",
                    experience_years
                )

                experience_years = (
                    int(match.group())
                    if match
                    else 0
                )

            elif not isinstance(
                experience_years,
                int
            ):

                experience_years = 0

            return {
                "skills": skills,
                "education": education,
                "experience_years": experience_years
            }

        except Exception as e:

            last_error = e

    print(
        f"extract_structured_information: "
        f"failed after {retries + 1} attempts. "
        f"Last error: {last_error}"
    )

    return {
        "skills": [],
        "education": [],
        "experience_years": 0
    }


def extract_resume_information(text):

    return extract_structured_information(
        text,
        mode="resume"
    )


def extract_job_information(text):

    return extract_structured_information(
        text,
        mode="job"
    )