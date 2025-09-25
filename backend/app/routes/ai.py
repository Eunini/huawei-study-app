from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import List, Optional
import json
import asyncio

from app.services.ollama_service import OllamaService
from app.schemas import (
    ChatRequest, ChatMessageResponse, ChatSessionResponse,
    QuizGenerationRequest, FlashcardGenerationRequest,
    ContentSummaryRequest, ConceptExplanationRequest,
    AIContentCreate, AIContentResponse
)
from app.dependencies import get_current_user, get_settings
from app.database import get_db
from app.models import ChatSession, ChatMessage, AIGeneratedContent, User
from sqlalchemy.orm import Session
import uuid

router = APIRouter(prefix="/ai", tags=["AI Features"])

@router.get("/health")
async def check_ai_health(settings = Depends(get_settings)):
    """Check if Ollama service is running and accessible."""
    ollama = OllamaService(settings)
    is_healthy = await ollama.health_check()
    
    if not is_healthy:
        raise HTTPException(status_code=503, detail="AI service is currently unavailable")
    
    models = await ollama.list_models()
    return {
        "status": "healthy",
        "available_models": [model.get("name", "unknown") for model in models],
        "current_model": settings.OLLAMA_MODEL
    }

@router.post("/chat")
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Chat with AI assistant."""
    ollama = OllamaService(settings)
    
    # Get or create chat session
    session_id = request.session_id
    if not session_id:
        # Create new session
        session = ChatSession(
            user_id=current_user.id,
            title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
            context_type=request.context_type,
            context_id=request.context_id
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        session_id = str(session.id)
    else:
        # Verify session belongs to user
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Save user message
    user_message = ChatMessage(
        session_id=session_id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    db.commit()
    
    # Get context if provided
    context = ""
    if request.context_type and request.context_id:
        # Add logic to fetch context from modules/topics
        pass
    
    # Generate AI response
    system_prompt = """You are a helpful AI tutor specializing in Huawei Cloud Computing and ICT topics. 
    Provide clear, accurate, and educational responses. Help students understand concepts, 
    answer questions, and guide their learning journey."""
    
    try:
        ai_response = await ollama.generate_response(
            prompt=request.message,
            system_prompt=system_prompt,
            context=context
        )
        
        # Save AI response
        ai_message = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=ai_response,
            model_used=settings.OLLAMA_MODEL,
            context_used=context if context else None
        )
        db.add(ai_message)
        db.commit()
        
        return {
            "session_id": session_id,
            "response": ai_response,
            "model_used": settings.OLLAMA_MODEL
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")

@router.post("/chat/stream")
async def stream_chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    settings = Depends(get_settings)
):
    """Stream chat response from AI assistant."""
    ollama = OllamaService(settings)
    
    system_prompt = """You are a helpful AI tutor specializing in Huawei Cloud Computing and ICT topics."""
    
    async def generate_stream():
        try:
            async for chunk in ollama.generate_streaming_response(
                prompt=request.message,
                system_prompt=system_prompt
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/stream-sent-events",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@router.post("/generate-quiz")
async def generate_quiz(
    request: QuizGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Generate quiz questions from content using AI."""
    ollama = OllamaService(settings)
    
    try:
        questions = await ollama.generate_quiz_questions(
            content=request.content,
            num_questions=request.num_questions
        )
        
        # Save generated content
        ai_content = AIGeneratedContent(
            source_type="general",
            content_type="quiz",
            title=f"AI Generated Quiz ({len(questions)} questions)",
            content=json.dumps(questions),
            metadata={"difficulty": request.difficulty, "num_questions": len(questions)},
            model_used=settings.OLLAMA_MODEL
        )
        db.add(ai_content)
        db.commit()
        
        return {
            "questions": questions,
            "generated_id": str(ai_content.id),
            "total_questions": len(questions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.post("/generate-flashcards")
async def generate_flashcards(
    request: FlashcardGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Generate flashcards from content using AI."""
    ollama = OllamaService(settings)
    
    try:
        flashcards = await ollama.generate_flashcards(
            content=request.content,
            num_cards=request.num_cards
        )
        
        # Save generated content
        ai_content = AIGeneratedContent(
            source_type="general",
            content_type="flashcard",
            title=f"AI Generated Flashcards ({len(flashcards)} cards)",
            content=json.dumps(flashcards),
            metadata={"category": request.category, "num_cards": len(flashcards)},
            model_used=settings.OLLAMA_MODEL
        )
        db.add(ai_content)
        db.commit()
        
        return {
            "flashcards": flashcards,
            "generated_id": str(ai_content.id),
            "total_cards": len(flashcards)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {str(e)}")

@router.post("/summarize")
async def summarize_content(
    request: ContentSummaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Summarize content using AI."""
    ollama = OllamaService(settings)
    
    try:
        summary = await ollama.summarize_content(
            content=request.content,
            max_length=request.max_length
        )
        
        # Save generated content
        ai_content = AIGeneratedContent(
            source_type="general",
            content_type="summary",
            title="AI Generated Summary",
            content=summary,
            metadata={"max_length": request.max_length, "original_length": len(request.content)},
            model_used=settings.OLLAMA_MODEL
        )
        db.add(ai_content)
        db.commit()
        
        return {
            "summary": summary,
            "generated_id": str(ai_content.id),
            "original_length": len(request.content),
            "summary_length": len(summary)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize content: {str(e)}")

@router.post("/explain-concept")
async def explain_concept(
    request: ConceptExplanationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings = Depends(get_settings)
):
    """Get AI explanation of a concept."""
    ollama = OllamaService(settings)
    
    try:
        explanation = await ollama.explain_concept(
            concept=request.concept,
            context=request.context or "",
            difficulty_level=request.difficulty_level
        )
        
        # Save generated content
        ai_content = AIGeneratedContent(
            source_type="general",
            content_type="explanation",
            title=f"Concept Explanation: {request.concept}",
            content=explanation,
            metadata={
                "concept": request.concept,
                "difficulty_level": request.difficulty_level,
                "has_context": bool(request.context)
            },
            model_used=settings.OLLAMA_MODEL
        )
        db.add(ai_content)
        db.commit()
        
        return {
            "concept": request.concept,
            "explanation": explanation,
            "difficulty_level": request.difficulty_level,
            "generated_id": str(ai_content.id)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to explain concept: {str(e)}")

@router.get("/chat-sessions")
async def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's chat sessions."""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).all()
    
    return [
        ChatSessionResponse(
            id=str(session.id),
            user_id=str(session.user_id),
            title=session.title,
            context_type=session.context_type,
            context_id=str(session.context_id) if session.context_id else None,
            created_at=session.created_at,
            updated_at=session.updated_at
        )
        for session in sessions
    ]

@router.get("/chat-sessions/{session_id}/messages")
async def get_chat_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages from a chat session."""
    # Verify session belongs to user
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.timestamp.asc()).all()
    
    return [
        ChatMessageResponse(
            id=str(message.id),
            session_id=str(message.session_id),
            role=message.role,
            content=message.content,
            timestamp=message.timestamp,
            model_used=message.model_used,
            context_used=message.context_used
        )
        for message in messages
    ]

@router.delete("/chat-sessions/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a chat session and all its messages."""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Delete messages first
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
    # Delete session
    db.delete(session)
    db.commit()
    
    return {"message": "Chat session deleted successfully"}