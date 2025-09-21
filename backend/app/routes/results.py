from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.schemas import ResultResponse, ResultSummary, UserResponse
from app.routes.auth import get_current_user
from app.services.results_service import ResultsService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[ResultResponse])
async def get_user_results(
    current_user: UserResponse = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0
):
    """Get user's exam results"""
    try:
        results_service = ResultsService()
        results = results_service.get_user_results(current_user.id, limit, offset)
        return results
        
    except Exception as e:
        logger.error(f"Get user results error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch results"
        )

@router.get("/{result_id}", response_model=ResultResponse)
async def get_result(
    result_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get specific result by ID"""
    try:
        results_service = ResultsService()
        result = results_service.get_result(result_id, current_user.id)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Result not found"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get result error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch result"
        )

@router.get("/summary/analytics", response_model=ResultSummary)
async def get_results_summary(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get user's results summary and analytics"""
    try:
        results_service = ResultsService()
        summary = results_service.get_results_summary(current_user.id)
        return summary
        
    except Exception as e:
        logger.error(f"Get results summary error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch results summary"
        )

@router.delete("/{result_id}")
async def delete_result(
    result_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a specific result"""
    try:
        results_service = ResultsService()
        success = results_service.delete_result(result_id, current_user.id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Result not found"
            )
        
        return {"message": "Result deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete result error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete result"
        )
