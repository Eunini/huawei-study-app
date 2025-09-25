from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.schemas import (
    ODFSModuleCreate, ODFSModuleUpdate, ODFSModuleResponse,
    ODFSTopicCreate, ODFSTopicUpdate, ODFSTopicResponse,
    UserProgressCreate, UserProgressUpdate, UserProgressResponse
)
from app.models import ODFSModule, ODFSTopic, UserProgress, User, AIGeneratedContent
from app.database import get_db
from app.dependencies import get_current_user, get_settings
from app.services.ollama_service import OllamaService
import uuid
import json

router = APIRouter(prefix="/odfs", tags=["ODFS Content"])

# ODFS Module endpoints
@router.post("/modules", response_model=ODFSModuleResponse)
async def create_odfs_module(
    module: ODFSModuleCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Create a new ODFS module."""
    # Check if module code already exists
    existing_module = db.query(ODFSModule).filter(ODFSModule.module_code == module.module_code).first()
    if existing_module:
        raise HTTPException(status_code=400, detail="Module code already exists")
    
    db_module = ODFSModule(**module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    
    # Generate AI summary in background
    background_tasks.add_task(generate_module_summary, str(db_module.id), db_module.content, settings)
    
    return ODFSModuleResponse(
        id=str(db_module.id),
        **module.dict(),
        ai_summary=None,
        created_at=db_module.created_at,
        updated_at=db_module.updated_at
    )

@router.get("/modules", response_model=List[ODFSModuleResponse])
async def get_odfs_modules(
    skip: int = 0,
    limit: int = 100,
    difficulty_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all ODFS modules."""
    query = db.query(ODFSModule)
    
    if difficulty_level:
        query = query.filter(ODFSModule.difficulty_level == difficulty_level)
    
    modules = query.offset(skip).limit(limit).all()
    
    return [
        ODFSModuleResponse(
            id=str(module.id),
            title=module.title,
            module_code=module.module_code,
            description=module.description,
            learning_objectives=module.learning_objectives,
            content=module.content,
            estimated_duration_hours=module.estimated_duration_hours,
            difficulty_level=module.difficulty_level,
            prerequisites=module.prerequisites,
            resources=module.resources,
            ai_summary=module.ai_summary,
            created_at=module.created_at,
            updated_at=module.updated_at
        )
        for module in modules
    ]

@router.get("/modules/{module_id}", response_model=ODFSModuleResponse)
async def get_odfs_module(
    module_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific ODFS module."""
    module = db.query(ODFSModule).filter(ODFSModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    return ODFSModuleResponse(
        id=str(module.id),
        title=module.title,
        module_code=module.module_code,
        description=module.description,
        learning_objectives=module.learning_objectives,
        content=module.content,
        estimated_duration_hours=module.estimated_duration_hours,
        difficulty_level=module.difficulty_level,
        prerequisites=module.prerequisites,
        resources=module.resources,
        ai_summary=module.ai_summary,
        created_at=module.created_at,
        updated_at=module.updated_at
    )

@router.put("/modules/{module_id}", response_model=ODFSModuleResponse)
async def update_odfs_module(
    module_id: str,
    module_update: ODFSModuleUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Update an ODFS module."""
    db_module = db.query(ODFSModule).filter(ODFSModule.id == module_id).first()
    if not db_module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    update_data = module_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_module, field, value)
    
    db.commit()
    db.refresh(db_module)
    
    # Regenerate AI summary if content changed
    if "content" in update_data:
        background_tasks.add_task(generate_module_summary, str(db_module.id), db_module.content, settings)
    
    return ODFSModuleResponse(
        id=str(db_module.id),
        title=db_module.title,
        module_code=db_module.module_code,
        description=db_module.description,
        learning_objectives=db_module.learning_objectives,
        content=db_module.content,
        estimated_duration_hours=db_module.estimated_duration_hours,
        difficulty_level=db_module.difficulty_level,
        prerequisites=db_module.prerequisites,
        resources=db_module.resources,
        ai_summary=db_module.ai_summary,
        created_at=db_module.created_at,
        updated_at=db_module.updated_at
    )

@router.delete("/modules/{module_id}")
async def delete_odfs_module(
    module_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an ODFS module."""
    db_module = db.query(ODFSModule).filter(ODFSModule.id == module_id).first()
    if not db_module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Delete related topics and progress records
    db.query(ODFSTopic).filter(ODFSTopic.module_id == module_id).delete()
    db.query(UserProgress).filter(UserProgress.module_id == module_id).delete()
    
    db.delete(db_module)
    db.commit()
    
    return {"message": "Module deleted successfully"}

# ODFS Topic endpoints
@router.post("/modules/{module_id}/topics", response_model=ODFSTopicResponse)
async def create_odfs_topic(
    module_id: str,
    topic: ODFSTopicCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Create a new topic within a module."""
    # Verify module exists
    module = db.query(ODFSModule).filter(ODFSModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Ensure topic belongs to the correct module
    topic_data = topic.dict()
    topic_data["module_id"] = module_id
    
    db_topic = ODFSTopic(**topic_data)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    
    # Generate AI explanation in background
    background_tasks.add_task(generate_topic_explanation, str(db_topic.id), db_topic.content, settings)
    
    return ODFSTopicResponse(
        id=str(db_topic.id),
        module_id=str(db_topic.module_id),
        title=db_topic.title,
        topic_code=db_topic.topic_code,
        content=db_topic.content,
        subtopics=db_topic.subtopics,
        key_concepts=db_topic.key_concepts,
        practical_skills=db_topic.practical_skills,
        difficulty_rating=db_topic.difficulty_rating,
        ai_explanation=None,
        created_at=db_topic.created_at,
        updated_at=db_topic.updated_at
    )

@router.get("/modules/{module_id}/topics", response_model=List[ODFSTopicResponse])
async def get_module_topics(
    module_id: str,
    db: Session = Depends(get_db)
):
    """Get all topics for a specific module."""
    topics = db.query(ODFSTopic).filter(ODFSTopic.module_id == module_id).all()
    
    return [
        ODFSTopicResponse(
            id=str(topic.id),
            module_id=str(topic.module_id),
            title=topic.title,
            topic_code=topic.topic_code,
            content=topic.content,
            subtopics=topic.subtopics,
            key_concepts=topic.key_concepts,
            practical_skills=topic.practical_skills,
            difficulty_rating=topic.difficulty_rating,
            ai_explanation=topic.ai_explanation,
            created_at=topic.created_at,
            updated_at=topic.updated_at
        )
        for topic in topics
    ]

@router.get("/topics/{topic_id}", response_model=ODFSTopicResponse)
async def get_odfs_topic(
    topic_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific ODFS topic."""
    topic = db.query(ODFSTopic).filter(ODFSTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    return ODFSTopicResponse(
        id=str(topic.id),
        module_id=str(topic.module_id),
        title=topic.title,
        topic_code=topic.topic_code,
        content=topic.content,
        subtopics=topic.subtopics,
        key_concepts=topic.key_concepts,
        practical_skills=topic.practical_skills,
        difficulty_rating=topic.difficulty_rating,
        ai_explanation=topic.ai_explanation,
        created_at=topic.created_at,
        updated_at=topic.updated_at
    )

# User Progress endpoints
@router.post("/progress", response_model=UserProgressResponse)
async def create_user_progress(
    progress: UserProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update user progress for a module/topic."""
    # Check if progress already exists
    existing_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.module_id == progress.module_id,
        UserProgress.topic_id == progress.topic_id
    ).first()
    
    if existing_progress:
        # Update existing progress
        for field, value in progress.dict(exclude_unset=True).items():
            if field != "user_id":  # Don't update user_id
                setattr(existing_progress, field, value)
        db.commit()
        db.refresh(existing_progress)
        return existing_progress
    else:
        # Create new progress record
        progress_data = progress.dict()
        progress_data["user_id"] = str(current_user.id)
        
        db_progress = UserProgress(**progress_data)
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)
        
        return UserProgressResponse(
            id=str(db_progress.id),
            user_id=str(db_progress.user_id),
            module_id=str(db_progress.module_id),
            topic_id=str(db_progress.topic_id) if db_progress.topic_id else None,
            progress_percentage=db_progress.progress_percentage,
            time_spent_minutes=db_progress.time_spent_minutes,
            completion_status=db_progress.completion_status,
            notes=db_progress.notes,
            last_accessed=db_progress.last_accessed,
            created_at=db_progress.created_at,
            updated_at=db_progress.updated_at
        )

@router.get("/progress", response_model=List[UserProgressResponse])
async def get_user_progress(
    module_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's progress across modules/topics."""
    query = db.query(UserProgress).filter(UserProgress.user_id == current_user.id)
    
    if module_id:
        query = query.filter(UserProgress.module_id == module_id)
    
    progress_records = query.order_by(desc(UserProgress.last_accessed)).all()
    
    return [
        UserProgressResponse(
            id=str(record.id),
            user_id=str(record.user_id),
            module_id=str(record.module_id),
            topic_id=str(record.topic_id) if record.topic_id else None,
            progress_percentage=record.progress_percentage,
            time_spent_minutes=record.time_spent_minutes,
            completion_status=record.completion_status,
            notes=record.notes,
            last_accessed=record.last_accessed,
            created_at=record.created_at,
            updated_at=record.updated_at
        )
        for record in progress_records
    ]

# Background task functions
async def generate_module_summary(module_id: str, content: str, settings):
    """Background task to generate AI summary for a module."""
    try:
        from app.database import SessionLocal
        ollama = OllamaService(settings)
        
        summary = await ollama.summarize_content(content, max_length=500)
        
        # Update database
        db = SessionLocal()
        try:
            module = db.query(ODFSModule).filter(ODFSModule.id == module_id).first()
            if module:
                module.ai_summary = summary
                db.commit()
        finally:
            db.close()
            
    except Exception as e:
        print(f"Failed to generate module summary: {e}")

async def generate_topic_explanation(topic_id: str, content: str, settings):
    """Background task to generate AI explanation for a topic."""
    try:
        from app.database import SessionLocal
        ollama = OllamaService(settings)
        
        explanation = await ollama.explain_concept(
            concept=content[:200],  # Use first 200 chars as concept
            context=content,
            difficulty_level="intermediate"
        )
        
        # Update database
        db = SessionLocal()
        try:
            topic = db.query(ODFSTopic).filter(ODFSTopic.id == topic_id).first()
            if topic:
                topic.ai_explanation = explanation
                db.commit()
        finally:
            db.close()
            
    except Exception as e:
        print(f"Failed to generate topic explanation: {e}")

@router.post("/modules/{module_id}/generate-content")
async def generate_module_content(
    module_id: str,
    content_type: str,  # "quiz", "flashcards", "summary"
    num_items: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Generate AI content (quiz, flashcards, etc.) for a specific module."""
    module = db.query(ODFSModule).filter(ODFSModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    ollama = OllamaService(settings)
    
    try:
        if content_type == "quiz":
            content = await ollama.generate_quiz_questions(module.content, num_items)
        elif content_type == "flashcards":
            content = await ollama.generate_flashcards(module.content, num_items)
        elif content_type == "summary":
            content = await ollama.summarize_content(module.content, num_items)
        else:
            raise HTTPException(status_code=400, detail="Invalid content type")
        
        # Save generated content
        ai_content = AIGeneratedContent(
            source_type="module",
            source_id=module_id,
            content_type=content_type,
            title=f"{content_type.title()} for {module.title}",
            content=json.dumps(content) if isinstance(content, (list, dict)) else content,
            content_metadata={"module_code": module.module_code, "num_items": num_items},
            model_used=settings.OLLAMA_MODEL
        )
        db.add(ai_content)
        db.commit()
        
        return {
            "content": content,
            "content_type": content_type,
            "generated_id": str(ai_content.id),
            "module_title": module.title
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate {content_type}: {str(e)}")