from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User

router = APIRouter()

@router.get("/exams")
async def get_exams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get available exams"""
    # TODO: Implement exam retrieval from database
    return {"message": "Exams endpoint - TODO"}

@router.post("/exams/{exam_id}/start")
async def start_exam(
    exam_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start an exam"""
    # TODO: Implement exam start logic
    return {"message": f"Starting exam {exam_id} - TODO"}