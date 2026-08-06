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

    # remove duplicates while preserving order

    seen = set()
    result = []

    for item in flattened:

        key = item.lower()

        if key not in seen:

            seen.add(key)
            result.append(item)

    return result


def extract_list(text, instruction, retries=1):

    prompt = f"""
You are an expert ATS Resume Parser.

Resume / Job Description:

{text}

Task:

{instruction}

Rules:

1. Return ONLY a JSON array.

2. Every element must be ONE individual item.

3. Never combine multiple skills into one string.

4. Remove duplicates.

5. Ignore soft skills.

6. Include ALL technical skills.

Technical skills include:

- Programming Languages
- Libraries
- Frameworks
- Databases
- Developer Tools
- Cloud Platforms
- Technologies
- APIs

VERY IMPORTANT:

If a resume contains

Programming Languages:
Python

Libraries:
Pandas
NumPy
Scikit-learn

Return

[
"Python",
"Pandas",
"NumPy",
"Scikit-learn"
]

If the resume contains

Python (Pandas, NumPy, Matplotlib)

Return

[
"Python",
"Pandas",
"NumPy",
"Matplotlib"
]

If the resume contains

Programming:
Python, SQL

Return

[
"Python",
"SQL"
]

Do NOT omit the programming language.

Do NOT explain anything.

Return ONLY valid JSON.

Example:

[
"Python",
"SQL",
"Pandas",
"NumPy",
"Machine Learning"
]
"""

    last_error = None

    for attempt in range(retries + 1):

        try:

            response = query_llm(prompt)

            start = response.find("[")
            end = response.rfind("]") + 1

            if start == -1 or end <= start:

                raise ValueError("No JSON array found.")

            raw_items = json.loads(
                response[start:end]
            )

            items = flatten_items(raw_items)

            if items:

                return items

            last_error = "Empty array"

        except Exception as e:

            last_error = e

    print(
        f"extract_list: giving up after {retries+1} attempts. Last error: {last_error}"
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

            last_error = "No integer found."

        except Exception as e:

            last_error = e

    print(
        f"extract_integer: giving up after {retries+1} attempts. Last error: {last_error}"
    )

    return 0


def extract_resume_information(text):

    return {

        "skills": extract_list(

            text,

            """
Extract ALL technical skills.

Include:

- Programming Languages
- Libraries
- Frameworks
- Databases
- Developer Tools
- Technologies
- APIs

Do NOT ignore programming languages.

If Python is listed as a programming language,
include Python.

Return ONLY technical skills.
"""
        ),

        "education": extract_list(

            text,

            """
Extract ONLY degree names.

Examples:

B.Sc. in Computer Science

B.E. Software Engineering

M.Sc. Data Science

Return only degrees.
"""
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

            """
Extract ALL required technical skills.

Include:

- Programming Languages
- Libraries
- Frameworks
- Databases
- Developer Tools
- Technologies
- APIs

Return ONLY technical skills.
"""
        ),

        "education": extract_list(

            text,

            """
Extract ONLY required degree names.
"""
        ),

        "experience_years": extract_integer(

            text,

            "How many years of professional experience are required?"

        )

    }