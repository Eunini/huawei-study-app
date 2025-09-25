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

# ODFS Module Models
class ODFSModuleBase(BaseModel):
    title: str
    module_code: str
    description: str
    learning_objectives: List[str]
    content: str
    estimated_duration_hours: int = 0
    difficulty_level: str = "intermediate"
    prerequisites: Optional[List[str]] = None
    resources: Optional[List[Dict[str, str]]] = None

class ODFSModuleCreate(ODFSModuleBase):
    pass

class ODFSModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    learning_objectives: Optional[List[str]] = None
    content: Optional[str] = None
    estimated_duration_hours: Optional[int] = None
    difficulty_level: Optional[str] = None
    prerequisites: Optional[List[str]] = None
    resources: Optional[List[Dict[str, str]]] = None
    ai_summary: Optional[str] = None

class ODFSModuleResponse(ODFSModuleBase):
    id: str
    ai_summary: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

# ODFS Topic Models
class ODFSTopicBase(BaseModel):
    module_id: str
    title: str
    topic_code: str
    content: str
    subtopics: Optional[List[str]] = None
    key_concepts: Optional[List[str]] = None
    practical_skills: Optional[List[str]] = None
    difficulty_rating: float = 1.0

class ODFSTopicCreate(ODFSTopicBase):
    pass

class ODFSTopicUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    subtopics: Optional[List[str]] = None
    key_concepts: Optional[List[str]] = None
    practical_skills: Optional[List[str]] = None
    ai_explanation: Optional[str] = None
    difficulty_rating: Optional[float] = None

class ODFSTopicResponse(ODFSTopicBase):
    id: str
    ai_explanation: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

# AI Generated Content Models
class AIContentCreate(BaseModel):
    source_type: str
    source_id: Optional[str] = None
    content_type: str
    title: str
    content: str
    content_metadata: Optional[Dict[str, Any]] = None

class AIContentResponse(BaseModel):
    id: str
    source_type: str
    source_id: Optional[str] = None
    content_type: str
    title: str
    content: str
    content_metadata: Optional[Dict[str, Any]] = None
    model_used: str
    generated_at: datetime
    is_verified: bool

# User Progress Models
class UserProgressBase(BaseModel):
    user_id: str
    module_id: str
    topic_id: Optional[str] = None
    progress_percentage: float = 0.0
    time_spent_minutes: int = 0
    completion_status: str = "not_started"
    notes: Optional[str] = None

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressUpdate(BaseModel):
    progress_percentage: Optional[float] = None
    time_spent_minutes: Optional[int] = None
    completion_status: Optional[str] = None
    notes: Optional[str] = None

class UserProgressResponse(UserProgressBase):
    id: str
    last_accessed: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

# Chat Models
class ChatSessionCreate(BaseModel):
    title: Optional[str] = "New Chat"
    context_type: Optional[str] = None
    context_id: Optional[str] = None

class ChatSessionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    context_type: Optional[str] = None
    context_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class ChatMessageCreate(BaseModel):
    session_id: str
    role: str
    content: str

class ChatMessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    timestamp: datetime
    model_used: Optional[str] = None
    context_used: Optional[str] = None

# AI Service Requests
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context_type: Optional[str] = None
    context_id: Optional[str] = None

class QuizGenerationRequest(BaseModel):
    content: str
    num_questions: int = 5
    difficulty: Optional[str] = "medium"

class FlashcardGenerationRequest(BaseModel):
    content: str
    num_cards: int = 10
    category: Optional[str] = None

class ContentSummaryRequest(BaseModel):
    content: str
    max_length: int = 300

class ConceptExplanationRequest(BaseModel):
    concept: str
    context: Optional[str] = None
    difficulty_level: str = "intermediate"
