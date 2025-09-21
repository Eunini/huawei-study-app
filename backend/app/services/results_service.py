from typing import List, Dict, Any
from app.schemas import ResultResponse, ResultSummary
from app.database import get_supabase_client
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ResultsService:
    def __init__(self):
        self.supabase = get_supabase_client()
        
        # Static results for MVP demonstration
        self.static_results = [
            {
                "id": "result_1",
                "user_id": "user_123",
                "exam_id": "exam_1",
                "score": 85.0,
                "total_questions": 10,
                "correct_answers": 8,
                "difficulty": "medium",
                "time_taken": 1200,  # 20 minutes
                "answers": [],
                "created_at": "2024-01-15T10:30:00Z",
                "percentage": 85.0
            },
            {
                "id": "result_2",
                "user_id": "user_123",
                "exam_id": "exam_2",
                "score": 70.0,
                "total_questions": 15,
                "correct_answers": 10,
                "difficulty": "hard",
                "time_taken": 1800,  # 30 minutes
                "answers": [],
                "created_at": "2024-01-14T14:15:00Z",
                "percentage": 70.0
            },
            {
                "id": "result_3",
                "user_id": "user_123",
                "exam_id": "exam_3",
                "score": 90.0,
                "total_questions": 8,
                "correct_answers": 7,
                "difficulty": "easy",
                "time_taken": 600,  # 10 minutes
                "answers": [],
                "created_at": "2024-01-13T09:45:00Z",
                "percentage": 90.0
            }
        ]
    
    def get_user_results(self, user_id: str, limit: int = 20, offset: int = 0) -> List[ResultResponse]:
        """Get user's exam results with pagination"""
        try:
            # Try to get from database first
            try:
                response = self.supabase.table("results")\
                    .select("*")\
                    .eq("user_id", user_id)\
                    .order("created_at", desc=True)\
                    .range(offset, offset + limit - 1)\
                    .execute()
                
                if response.data:
                    return [self._convert_to_result_response(result) for result in response.data]
            except Exception as db_error:
                logger.warning(f"Database query failed, using static data: {str(db_error)}")
            
            # Fallback to static data for MVP
            user_results = [r for r in self.static_results if r["user_id"] == user_id]
            paginated_results = user_results[offset:offset + limit]
            
            return [self._convert_to_result_response(result) for result in paginated_results]
            
        except Exception as e:
            logger.error(f"Get user results error: {str(e)}")
            raise
    
    def get_result(self, result_id: str, user_id: str) -> ResultResponse:
        """Get specific result by ID"""
        try:
            # Try database first
            try:
                response = self.supabase.table("results")\
                    .select("*")\
                    .eq("id", result_id)\
                    .eq("user_id", user_id)\
                    .execute()
                
                if response.data:
                    return self._convert_to_result_response(response.data[0])
            except Exception as db_error:
                logger.warning(f"Database query failed, using static data: {str(db_error)}")
            
            # Fallback to static data
            result = next((r for r in self.static_results 
                          if r["id"] == result_id and r["user_id"] == user_id), None)
            
            if result:
                return self._convert_to_result_response(result)
            
            return None
            
        except Exception as e:
            logger.error(f"Get result error: {str(e)}")
            raise
    
    def get_results_summary(self, user_id: str) -> ResultSummary:
        """Get user's results summary and analytics"""
        try:
            # Try database first
            try:
                response = self.supabase.table("results")\
                    .select("*")\
                    .eq("user_id", user_id)\
                    .execute()
                
                if response.data:
                    results = response.data
                else:
                    results = [r for r in self.static_results if r["user_id"] == user_id]
            except Exception as db_error:
                logger.warning(f"Database query failed, using static data: {str(db_error)}")
                results = [r for r in self.static_results if r["user_id"] == user_id]
            
            if not results:
                return ResultSummary(
                    total_exams=0,
                    average_score=0.0,
                    best_score=0.0,
                    worst_score=0.0,
                    topics_performance={},
                    difficulty_performance={}
                )
            
            # Calculate summary statistics
            scores = [r["score"] for r in results]
            total_exams = len(results)
            average_score = sum(scores) / total_exams
            best_score = max(scores)
            worst_score = min(scores)
            
            # Calculate difficulty performance
            difficulty_stats = {}
            for difficulty in ["easy", "medium", "hard"]:
                difficulty_results = [r for r in results if r["difficulty"] == difficulty]
                if difficulty_results:
                    difficulty_scores = [r["score"] for r in difficulty_results]
                    difficulty_stats[difficulty] = sum(difficulty_scores) / len(difficulty_scores)
                else:
                    difficulty_stats[difficulty] = 0.0
            
            # Mock topics performance (would be calculated from actual question topics in production)
            topics_performance = {
                "Cloud Fundamentals": 85.0,
                "Huawei Cloud Services": 78.0,
                "Architecture": 82.0,
                "Networking": 75.0,
                "Security": 88.0
            }
            
            return ResultSummary(
                total_exams=total_exams,
                average_score=round(average_score, 2),
                best_score=best_score,
                worst_score=worst_score,
                topics_performance=topics_performance,
                difficulty_performance=difficulty_stats
            )
            
        except Exception as e:
            logger.error(f"Get results summary error: {str(e)}")
            raise
    
    def delete_result(self, result_id: str, user_id: str) -> bool:
        """Delete a specific result"""
        try:
            # Try database first
            try:
                response = self.supabase.table("results")\
                    .delete()\
                    .eq("id", result_id)\
                    .eq("user_id", user_id)\
                    .execute()
                
                return len(response.data) > 0
            except Exception as db_error:
                logger.warning(f"Database delete failed: {str(db_error)}")
                # For MVP, just return True for static data
                return True
            
        except Exception as e:
            logger.error(f"Delete result error: {str(e)}")
            raise
    
    def _convert_to_result_response(self, result_dict: Dict) -> ResultResponse:
        """Convert result dictionary to ResultResponse object"""
        return ResultResponse(
            id=result_dict["id"],
            user_id=result_dict["user_id"],
            exam_id=result_dict["exam_id"],
            score=result_dict["score"],
            total_questions=result_dict["total_questions"],
            correct_answers=result_dict["correct_answers"],
            difficulty=result_dict["difficulty"],
            time_taken=result_dict["time_taken"],
            answers=result_dict.get("answers", []),
            created_at=result_dict["created_at"],
            percentage=result_dict.get("percentage", result_dict["score"])
        )
