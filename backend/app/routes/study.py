from fastapi import APIRouter, HTTPException, Depends, status, Response
from fastapi.responses import FileResponse
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user, get_optional_user, get_settings
from app.schemas import StudyMaterialResponse, FlashcardResponse
from app.models import User, StudyMaterial, AIGeneratedContent
from datetime import datetime
from app.services.pdf_service import extract_text_from_pdf
from app.services.ollama_service import OllamaService
import logging
import os
import json
from typing import Dict

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/materials", response_model=List[StudyMaterialResponse])
async def get_study_materials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all study materials"""
    # TODO: Implement study materials retrieval from database
    return []

@router.get("/flashcards", response_model=List[FlashcardResponse])
async def get_flashcards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all flashcards"""
    # TODO: Implement flashcards retrieval from database
    return []


@router.get('/textbooks', response_model=List[Dict])
async def list_textbooks(
    current_user: User = Depends(get_optional_user),
):
    """List PDF textbooks found in the repo root directory.

    Returns a simple metadata list with filename, title, size and last_modified.
    """
    # base repo root and configured textbooks folder
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    settings = get_settings()
    textbooks_dir = os.path.join(repo_root, settings.TEXTBOOKS_FOLDER)

    textbooks = []
    try:
        # ensure folder exists
        if not os.path.isdir(textbooks_dir):
            return []

        for entry in os.listdir(textbooks_dir):
            if not entry.lower().endswith('.pdf'):
                continue

            file_path = os.path.join(textbooks_dir, entry)
            if not os.path.isfile(file_path):
                continue

            stat = os.stat(file_path)
            textbooks.append({
                'filename': entry,
                'title': os.path.splitext(entry)[0],
                'size_bytes': stat.st_size,
                'last_modified': stat.st_mtime,
                'url': f"/api/study/textbooks/{entry}"
            })

    except Exception as e:
        logger.exception('Failed listing textbooks')
        raise HTTPException(status_code=500, detail='Failed to list textbooks')

    return textbooks


@router.get('/textbooks/{filename}')
async def get_textbook(filename: str, current_user: User = Depends(get_optional_user)):
    """Return a PDF FileResponse for a given filename in the repository root.

    Security: Only serve plain filenames (no path separators) and only .pdf files.
    """
    # Basic validation: disallow path separators
    if '/' in filename or '\\' in filename:
        raise HTTPException(status_code=400, detail='Invalid filename')

    if not filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF files are supported')

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    settings = get_settings()
    textbooks_dir = os.path.join(repo_root, settings.TEXTBOOKS_FOLDER)
    file_path = os.path.join(textbooks_dir, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail='Textbook not found')

    # Return the file as application/pdf
    return FileResponse(path=file_path, media_type='application/pdf', filename=filename)


@router.post('/textbooks/import/{filename}', response_model=StudyMaterialResponse)
async def import_textbook(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user),
    settings = Depends(get_settings),
):
    """Extract text from a PDF in the textbooks folder and create a StudyMaterial record.

    If a StudyMaterial with the same title already exists, return that record instead of creating a duplicate.
    """
    # Validate filename
    if '/' in filename or '\\' in filename:
        raise HTTPException(status_code=400, detail='Invalid filename')

    if not filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF files are supported')

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    textbooks_dir = os.path.join(repo_root, settings.TEXTBOOKS_FOLDER)
    file_path = os.path.join(textbooks_dir, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail='Textbook not found')

    # Determine a reasonable title
    title = os.path.splitext(filename)[0]

    # Extract text (limit to first 300 pages / 200_000 chars to avoid memory blowups)
    extracted = extract_text_from_pdf(file_path, max_pages=300, max_chars=200000)

    # If extraction yields nothing, fall back to a short placeholder so import still works
    if not extracted:
        extracted = f"[Imported PDF: {filename}] — no extractable text found."

    # If a DB is available try to find existing material and insert new; if not, fall back to returning extracted content
    try:
        existing = db.query(StudyMaterial).filter(StudyMaterial.title == title).first()
        if existing:
            return StudyMaterialResponse(
                id=str(existing.id),
                title=existing.title,
                content=existing.content,
                category=existing.category,
                description=existing.description,
                created_at=existing.created_at,
                updated_at=existing.updated_at,
            )

        # Create StudyMaterial entry
        # 'material' is either a DB-backed object (if commit succeeded) or a transient stub

        return StudyMaterialResponse(
            id=str(material.id),
            title=material.title,
            content=material.content,
            category=material.category,
            description=material.description,
            created_at=material.created_at,
            updated_at=material.updated_at,
        )
    except Exception:
        # DB not available (or other DB error) — return fallback response using timestamps
        return StudyMaterialResponse(
            id=f"local-{filename}",
            title=title,
            content=extracted,
            category='Textbook',
            description=f'Imported from {filename} (not saved to DB in this environment)',
            created_at=datetime.utcnow(),
            updated_at=None,
        )

    # No DB/creation path left here — we already returned above on success or fallback


@router.post('/textbooks/{filename}/generate')
async def generate_from_textbook(
    filename: str,
    generate_summary: bool = True,
    generate_flashcards: bool = True,
    generate_quiz: bool = True,
    num_flashcards: int = 10,
    num_questions: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user),
    settings = Depends(get_settings),
):
    """Import the PDF if necessary, then generate AI content from its text.

    Returns a summary of generated objects and their database ids.
    """
    # Validate filename
    if '/' in filename or '\\' in filename:
        raise HTTPException(status_code=400, detail='Invalid filename')

    if not filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF files are supported')

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    textbooks_dir = os.path.join(repo_root, settings.TEXTBOOKS_FOLDER)
    file_path = os.path.join(textbooks_dir, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail='Textbook not found')

    title = os.path.splitext(filename)[0]

    # Ensure material exists (DB may not be available)
    try:
        material = db.query(StudyMaterial).filter(StudyMaterial.title == title).first()
    except Exception:
        material = None

    if not material:
        extracted = extract_text_from_pdf(file_path, max_pages=300, max_chars=200000)
        if not extracted:
            raise HTTPException(status_code=500, detail='Failed to extract text from PDF')

        # try to persist material to DB but allow fallback
        try:
            material = StudyMaterial(
                title=title,
                content=extracted,
                category='Textbook',
                description=f'Imported from {filename}'
            )
            db.add(material)
            db.commit()
            db.refresh(material)
        except Exception:
            # leave material as a transient object-like dict
            material = type('MaterialStub', (), {
                'id': f'local-{filename}',
                'title': title,
                'content': extracted
            })()

        material = StudyMaterial(
            title=title,
            content=extracted,
            category='Textbook',
            description=f'Imported from {filename}'
        )
        db.add(material)
        db.commit()
        db.refresh(material)

    # Run AI generation
    ollama = OllamaService(settings)

    results = {}

    if generate_summary:
        summary = await ollama.summarize_content(material.content, max_length=300)
        try:
            ai_row = AIGeneratedContent(
            source_type='textbook',
            source_id=material.id,
            content_type='summary',
            title=f"Summary for {material.title}",
            content=summary,
            content_metadata={'filename': filename},
            model_used=settings.OLLAMA_MODEL
        )
            db.add(ai_row)
            db.commit()
            db.refresh(ai_row)
            results['summary'] = {'id': str(ai_row.id), 'content': summary}
        except Exception:
            results['summary'] = {'id': None, 'content': summary}

    if generate_flashcards:
        cards = await ollama.generate_flashcards(material.content, num_flashcards)
        try:
            ai_row = AIGeneratedContent(
            source_type='textbook',
            source_id=material.id,
            content_type='flashcards',
            title=f"Flashcards for {material.title}",
            content=json.dumps(cards),
            content_metadata={'filename': filename, 'num_cards': num_flashcards},
            model_used=settings.OLLAMA_MODEL
        )
            db.add(ai_row)
            db.commit()
            db.refresh(ai_row)
            results['flashcards'] = {'id': str(ai_row.id), 'count': len(cards), 'cards': cards}
        except Exception:
            results['flashcards'] = {'id': None, 'count': len(cards), 'cards': cards}

    if generate_quiz:
        questions = await ollama.generate_quiz_questions(material.content, num_questions)
        try:
            ai_row = AIGeneratedContent(
            source_type='textbook',
            source_id=material.id,
            content_type='quiz',
            title=f"Quiz for {material.title}",
            content=json.dumps(questions),
            content_metadata={'filename': filename, 'num_questions': num_questions},
            model_used=settings.OLLAMA_MODEL
        )
            db.add(ai_row)
            db.commit()
            db.refresh(ai_row)
            results['quiz'] = {'id': str(ai_row.id), 'count': len(questions), 'questions': questions}
        except Exception:
            results['quiz'] = {'id': None, 'count': len(questions), 'questions': questions}

    return {'material_id': str(material.id), 'generated': results}