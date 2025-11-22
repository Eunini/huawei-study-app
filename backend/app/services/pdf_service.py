import logging
from typing import Optional
from pypdf import PdfReader

logger = logging.getLogger(__name__)


def extract_text_from_pdf(path: str, max_pages: Optional[int] = None, max_chars: Optional[int] = None) -> str:
    """Extract text from a PDF file using pypdf (PyPDF2 v3 API).

    - max_pages: limit how many pages to read (None = all)
    - max_chars: truncate the returned text to this many characters (None = no truncation)
    """
    try:
        reader = PdfReader(path)
        total_pages = len(reader.pages)
        pages_to_read = total_pages if max_pages is None else min(max_pages, total_pages)

        text_parts = []
        for i in range(pages_to_read):
            try:
                page = reader.pages[i]
                page_text = page.extract_text() or ""
                text_parts.append(page_text)
            except Exception as e:
                logger.debug(f"Failed to extract page {i} from {path}: {e}")

        full_text = "\n\n".join(text_parts).strip()

        if max_chars is not None and len(full_text) > max_chars:
            return full_text[:max_chars]

        return full_text

    except Exception as e:
        logger.exception(f"Error extracting text from PDF {path}: {e}")
        return ""
