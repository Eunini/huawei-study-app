from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.schemas import (
    ExamConfigRequest, ExamResponse, ExamSubmission, 
    QuestionResponse, DifficultyLevel, UserResponse
)
from app.routes.auth import get_current_user
from app.services.exam_service import ExamService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create", response_model=ExamResponse)
async def create_exam(
    config: ExamConfigRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new exam with specified configuration"""
    try:
        exam_service = ExamService()
        exam = exam_service.create_exam(config)
        return exam
        
    except Exception as e:
        logger.error(f"Create exam error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create exam"
        )

@router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(
    exam_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get exam by ID"""
    try:
        exam_service = ExamService()
        exam = exam_service.get_exam(exam_id)
        
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        return exam
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get exam error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch exam"
        )

@router.post("/{exam_id}/submit")
async def submit_exam(
    exam_id: str,
    submission: ExamSubmission,
    current_user: UserResponse = Depends(get_current_user)
):
    """Submit exam answers and get results"""
    try:
        exam_service = ExamService()
        result = exam_service.evaluate_exam(exam_id, submission, current_user.id)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Submit exam error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit exam"
        )

@router.get("/questions/topics")
async def get_available_topics(current_user: UserResponse = Depends(get_current_user)):
    """Get list of available question topics"""
    try:
        exam_service = ExamService()
        topics = exam_service.get_available_topics()
        return {"topics": topics}
        
    except Exception as e:
        logger.error(f"Get topics error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch topics"
        )
