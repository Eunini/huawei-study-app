from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Supabase Configuration (optional for development)
    SUPABASE_URL: str = "https://dummy.supabase.co"
    SUPABASE_KEY: str = "dummy-key"
    SUPABASE_JWT_SECRET: str = "dummy-secret"
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./huawei_study.db"
    
    # Ollama Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:8b"
    OLLAMA_TIMEOUT: int = 120
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app"
    ]
    
    # JWT Configuration
    SECRET_KEY: str = "gDBrlC8PfEZ6tB7xABi3IOrFGR4pDzdf"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App Configuration
    APP_NAME: str = "Huawei ICT Cloud Track Study App"
    DEBUG: bool = True
    # Local folder under the repository root where textbook PDF files live
    TEXTBOOKS_FOLDER: str = "textbooks"
    
    class Config:
        env_file = ".env"

settings = Settings()
