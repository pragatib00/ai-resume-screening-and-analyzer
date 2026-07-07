import fitz
import re
import nltk

from nltk.corpus import stopwords

try:
    stopwords.words("english")
except LookupError:
    nltk.download("stopwords")


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from every page of a PDF.
    """

    document = fitz.open(pdf_path)

    text = ""

    for page in document:

        text += page.get_text()

    document.close()

    return text


def clean_text(text: str) -> str:
    """
    Basic text cleaning before sending to the LLM.
    """

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    text = text.strip()

    return text