from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_JWT_SECRET: str
    
    # Database Configuration
    DATABASE_URL: str = ""
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app"
    ]
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App Configuration
    APP_NAME: str = "Huawei ICT Cloud Track Study App"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
