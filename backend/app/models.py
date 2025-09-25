from sqlalchemy import Column, String, DateTime, Integer, Float, JSON, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class StudyMaterial(Base):
    __tablename__ = "study_materials"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # Array of options
    correct_answer = Column(String, nullable=False)
    explanation = Column(Text)
    difficulty = Column(String, nullable=False)  # easy, medium, hard
    topic = Column(String, nullable=False)
    question_type = Column(String, default="multiple_choice")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Result(Base):
    __tablename__ = "results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    exam_id = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    difficulty = Column(String, nullable=False)
    time_taken = Column(Integer, nullable=False)  # in seconds
    answers = Column(JSON, nullable=False)  # Array of user answers with question details
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ODFSModule(Base):
    __tablename__ = "odfs_modules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    module_code = Column(String, unique=True, nullable=False)  # e.g., "M1", "M2"
    description = Column(Text, nullable=False)
    learning_objectives = Column(JSON, nullable=False)  # Array of objectives
    content = Column(Text, nullable=False)
    estimated_duration_hours = Column(Integer, default=0)
    difficulty_level = Column(String, default="intermediate")  # beginner, intermediate, advanced
    prerequisites = Column(JSON)  # Array of prerequisite module codes
    resources = Column(JSON)  # Array of resource links/files
    ai_summary = Column(Text)  # AI-generated summary
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ODFSTopic(Base):
    __tablename__ = "odfs_topics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=False)
    topic_code = Column(String, nullable=False)  # e.g., "M1.1", "M1.2"
    content = Column(Text, nullable=False)
    subtopics = Column(JSON)  # Array of subtopic names
    key_concepts = Column(JSON)  # Array of key concepts
    practical_skills = Column(JSON)  # Array of practical skills to master
    ai_explanation = Column(Text)  # AI-generated detailed explanation
    difficulty_rating = Column(Float, default=1.0)  # 1-5 scale
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AIGeneratedContent(Base):
    __tablename__ = "ai_generated_content"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type = Column(String, nullable=False)  # "module", "topic", "general"
    source_id = Column(UUID(as_uuid=True))  # ID of the source module/topic
    content_type = Column(String, nullable=False)  # "summary", "quiz", "flashcard", "explanation"
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    content_metadata = Column(JSON)  # Additional data like difficulty, category, etc.
    model_used = Column(String, default="llama3.1:8b")
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    is_verified = Column(Boolean, default=False)  # Human verification status

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    module_id = Column(UUID(as_uuid=True), nullable=False)
    topic_id = Column(UUID(as_uuid=True))  # Optional: specific topic
    progress_percentage = Column(Float, default=0.0)  # 0-100
    time_spent_minutes = Column(Integer, default=0)
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    completion_status = Column(String, default="not_started")  # not_started, in_progress, completed
    notes = Column(Text)  # User's personal notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, default="New Chat")
    context_type = Column(String)  # "module", "topic", "general"
    context_id = Column(UUID(as_uuid=True))  # ID of related module/topic
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    model_used = Column(String)  # Only for assistant messages
    context_used = Column(Text)  # Context provided to the AI
