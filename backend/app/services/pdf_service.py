import fitz
import re


def extract_text_from_pdf(pdf_path: str) -> str:

    document = fitz.open(pdf_path)

    text = ""

    for page in document:

        text += page.get_text()

    document.close()

    return text


def clean_text(text: str) -> str:

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    text = text.strip()

    return text