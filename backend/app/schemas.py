from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Study Material Models
class StudyMaterialBase(BaseModel):
    title: str
    content: str
    category: str
    description: Optional[str] = None

class StudyMaterialCreate(StudyMaterialBase):
    pass

class StudyMaterialUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None

class StudyMaterialResponse(StudyMaterialBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Question Models
class QuestionBase(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: DifficultyLevel
    topic: str
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    question: Optional[str] = None
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    topic: Optional[str] = None
    question_type: Optional[QuestionType] = None

class QuestionResponse(QuestionBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

# Exam Models
class ExamConfigRequest(BaseModel):
    difficulty: DifficultyLevel
    topic: Optional[str] = None
    question_count: int = 20
    time_limit: int = 30  # minutes

class ExamResponse(BaseModel):
    id: str
    questions: List[QuestionResponse]
    time_limit: int
    created_at: datetime

class AnswerSubmission(BaseModel):
    question_id: str
    selected_answer: str

class ExamSubmission(BaseModel):
    exam_id: str
    answers: List[AnswerSubmission]
    time_taken: int  # seconds

# Results Models
class ResultBase(BaseModel):
    user_id: str
    exam_id: str
    score: float
    total_questions: int
    correct_answers: int
    difficulty: DifficultyLevel
    time_taken: int
    answers: List[Dict[str, Any]]

class ResultCreate(ResultBase):
    pass

class ResultResponse(ResultBase):
    id: str
    created_at: datetime
    percentage: float

class ResultSummary(BaseModel):
    total_exams: int
    average_score: float
    best_score: float
    worst_score: float
    topics_performance: Dict[str, float]
    difficulty_performance: Dict[str, float]

# Flashcard Models
class FlashcardBase(BaseModel):
    front: str
    back: str
    category: str
    difficulty: DifficultyLevel

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(FlashcardBase):
    id: str
    created_at: datetime
