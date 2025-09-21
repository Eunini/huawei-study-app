from typing import List, Dict, Any
from app.schemas import (
    ExamConfigRequest, ExamResponse, ExamSubmission, 
    QuestionResponse, ResultCreate, DifficultyLevel
)
from app.utils.randomizer import QuestionRandomizer
from app.database import get_supabase_client
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ExamService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.randomizer = QuestionRandomizer()
        
        # Static questions for MVP
        self.static_questions = [
            {
                "id": "q1",
                "question": "What are the three main cloud service models?",
                "options": [
                    "IaaS, PaaS, SaaS",
                    "Public, Private, Hybrid",
                    "On-premises, Cloud, Edge",
                    "Compute, Storage, Network"
                ],
                "correct_answer": "IaaS, PaaS, SaaS",
                "explanation": "The three main cloud service models are Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
                "difficulty": "easy",
                "topic": "Cloud Fundamentals",
                "question_type": "multiple_choice"
            },
            {
                "id": "q2",
                "question": "Which Huawei Cloud service provides virtual machines?",
                "options": [
                    "OBS",
                    "ECS",
                    "VPC",
                    "RDS"
                ],
                "correct_answer": "ECS",
                "explanation": "ECS (Elastic Cloud Server) is Huawei Cloud's virtual machine service.",
                "difficulty": "easy",
                "topic": "Huawei Cloud Services",
                "question_type": "multiple_choice"
            },
            {
                "id": "q3",
                "question": "What does VPC stand for in cloud computing?",
                "options": [
                    "Virtual Private Cloud",
                    "Virtual Public Cloud",
                    "Virtual Processing Center",
                    "Virtual Platform Configuration"
                ],
                "correct_answer": "Virtual Private Cloud",
                "explanation": "VPC stands for Virtual Private Cloud, which provides isolated network environments in the cloud.",
                "difficulty": "easy",
                "topic": "Networking",
                "question_type": "multiple_choice"
            },
            {
                "id": "q4",
                "question": "Which principle ensures that cloud resources can be scaled up or down based on demand?",
                "options": [
                    "Resource pooling",
                    "Rapid elasticity",
                    "Measured service",
                    "Broad network access"
                ],
                "correct_answer": "Rapid elasticity",
                "explanation": "Rapid elasticity allows cloud resources to be automatically scaled up or down based on demand.",
                "difficulty": "medium",
                "topic": "Cloud Fundamentals",
                "question_type": "multiple_choice"
            },
            {
                "id": "q5",
                "question": "What is the primary purpose of a load balancer in cloud architecture?",
                "options": [
                    "Store data",
                    "Distribute incoming requests across multiple servers",
                    "Provide security",
                    "Monitor performance"
                ],
                "correct_answer": "Distribute incoming requests across multiple servers",
                "explanation": "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.",
                "difficulty": "medium",
                "topic": "Architecture",
                "question_type": "multiple_choice"
            },
            {
                "id": "q6",
                "question": "In microservices architecture, what is the recommended approach for data management?",
                "options": [
                    "Single shared database for all services",
                    "Each service should have its own database",
                    "No databases, only file storage",
                    "In-memory storage only"
                ],
                "correct_answer": "Each service should have its own database",
                "explanation": "In microservices architecture, each service should manage its own data to maintain loose coupling and independence.",
                "difficulty": "hard",
                "topic": "Architecture",
                "question_type": "multiple_choice"
            },
            {
                "id": "q7",
                "question": "What is the difference between horizontal and vertical scaling?",
                "options": [
                    "Horizontal adds more servers, vertical increases server capacity",
                    "Horizontal increases server capacity, vertical adds more servers",
                    "Both are the same",
                    "Horizontal is for storage, vertical is for compute"
                ],
                "correct_answer": "Horizontal adds more servers, vertical increases server capacity",
                "explanation": "Horizontal scaling (scale out) adds more servers, while vertical scaling (scale up) increases the capacity of existing servers.",
                "difficulty": "hard",
                "topic": "Scalability",
                "question_type": "multiple_choice"
            },
            {
                "id": "q8",
                "question": "Which Huawei Cloud service is used for object storage?",
                "options": [
                    "EVS",
                    "SFS",
                    "OBS",
                    "CBR"
                ],
                "correct_answer": "OBS",
                "explanation": "OBS (Object Storage Service) is Huawei Cloud's object storage service for storing and retrieving any amount of data.",
                "difficulty": "easy",
                "topic": "Huawei Cloud Services",
                "question_type": "multiple_choice"
            },
            {
                "id": "q9",
                "question": "What is the main benefit of using containerization in cloud deployments?",
                "options": [
                    "Reduced security",
                    "Application portability and consistency",
                    "Increased complexity",
                    "Higher resource usage"
                ],
                "correct_answer": "Application portability and consistency",
                "explanation": "Containerization provides application portability and consistency across different environments.",
                "difficulty": "medium",
                "topic": "Containers",
                "question_type": "multiple_choice"
            },
            {
                "id": "q10",
                "question": "In a multi-cloud strategy, what is the primary challenge?",
                "options": [
                    "Cost reduction",
                    "Vendor lock-in avoidance",
                    "Complexity management and integration",
                    "Performance improvement"
                ],
                "correct_answer": "Complexity management and integration",
                "explanation": "Multi-cloud strategies introduce complexity in managing and integrating services across different cloud providers.",
                "difficulty": "hard",
                "topic": "Multi-Cloud",
                "question_type": "multiple_choice"
            }
        ]
    
    def create_exam(self, config: ExamConfigRequest) -> ExamResponse:
        """Create a new exam with randomized questions"""
        try:
            # Filter questions by difficulty and topic
            filtered_questions = self._filter_questions(config.difficulty, config.topic)
            
            # Randomize and select questions
            selected_questions = self.randomizer.select_questions(
                filtered_questions, 
                config.question_count
            )
            
            # Create exam
            exam_id = str(uuid.uuid4())
            exam = ExamResponse(
                id=exam_id,
                questions=[self._convert_to_question_response(q) for q in selected_questions],
                time_limit=config.time_limit,
                created_at=datetime.now()
            )
            
            # Store exam in memory/cache for this session (in production, use Redis or database)
            # For MVP, we'll just return the exam
            
            return exam
            
        except Exception as e:
            logger.error(f"Create exam error: {str(e)}")
            raise
    
    def get_exam(self, exam_id: str) -> ExamResponse:
        """Get exam by ID (for MVP, create a new one)"""
        # For MVP, create a default exam
        config = ExamConfigRequest(
            difficulty=DifficultyLevel.MEDIUM,
            question_count=10,
            time_limit=20
        )
        return self.create_exam(config)
    
    def evaluate_exam(self, exam_id: str, submission: ExamSubmission, user_id: str):
        """Evaluate exam submission and save results"""
        try:
            # Get exam questions (for MVP, use static questions)
            questions_dict = {q["id"]: q for q in self.static_questions}
            
            correct_answers = 0
            total_questions = len(submission.answers)
            detailed_answers = []
            
            # Evaluate each answer
            for answer in submission.answers:
                question = questions_dict.get(answer.question_id)
                if question:
                    is_correct = answer.selected_answer == question["correct_answer"]
                    if is_correct:
                        correct_answers += 1
                    
                    detailed_answers.append({
                        "question_id": answer.question_id,
                        "question": question["question"],
                        "selected_answer": answer.selected_answer,
                        "correct_answer": question["correct_answer"],
                        "is_correct": is_correct,
                        "explanation": question["explanation"]
                    })
            
            # Calculate score
            score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
            
            # Create result
            result_data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "exam_id": exam_id,
                "score": score,
                "total_questions": total_questions,
                "correct_answers": correct_answers,
                "difficulty": "medium",  # Default for MVP
                "time_taken": submission.time_taken,
                "answers": detailed_answers,
                "created_at": datetime.now().isoformat()
            }
            
            # Save to Supabase (with error handling)
            try:
                self.supabase.table("results").insert(result_data).execute()
            except Exception as db_error:
                logger.warning(f"Failed to save result to database: {str(db_error)}")
                # Continue with in-memory result for MVP
            
            return {
                "result_id": result_data["id"],
                "score": score,
                "correct_answers": correct_answers,
                "total_questions": total_questions,
                "percentage": round(score, 2),
                "answers": detailed_answers,
                "time_taken": submission.time_taken
            }
            
        except Exception as e:
            logger.error(f"Evaluate exam error: {str(e)}")
            raise
    
    def get_available_topics(self) -> List[str]:
        """Get list of available question topics"""
        topics = set()
        for question in self.static_questions:
            topics.add(question["topic"])
        return sorted(list(topics))
    
    def _filter_questions(self, difficulty: DifficultyLevel, topic: str = None) -> List[Dict]:
        """Filter questions by difficulty and topic"""
        filtered = []
        for question in self.static_questions:
            if question["difficulty"] == difficulty.value:
                if topic is None or question["topic"].lower() == topic.lower():
                    filtered.append(question)
        
        # If no questions found for specific criteria, return all questions of the difficulty
        if not filtered and topic:
            for question in self.static_questions:
                if question["difficulty"] == difficulty.value:
                    filtered.append(question)
        
        return filtered
    
    def _convert_to_question_response(self, question_dict: Dict) -> QuestionResponse:
        """Convert question dictionary to QuestionResponse object"""
        return QuestionResponse(
            id=question_dict["id"],
            question=question_dict["question"],
            options=question_dict["options"],
            correct_answer=question_dict["correct_answer"],
            explanation=question_dict["explanation"],
            difficulty=question_dict["difficulty"],
            topic=question_dict["topic"],
            question_type=question_dict["question_type"],
            created_at=datetime.now()
        )
