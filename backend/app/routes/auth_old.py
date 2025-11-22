from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas import UserCreate, UserResponse, LoginRequest, Token
from app.database import get_supabase_client
from supabase import Client
import logging

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserResponse)
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import create_access_token, get_current_user
from app.schemas import UserCreate, UserResponse, LoginRequest, LoginResponse, UserUpdate
from app.models import User
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Register user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "name": user_data.name
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
        
        # Create user profile in database
        user_profile = {
            "id": auth_response.user.id,
            "email": user_data.email,
            "name": user_data.name
        }
        
        # Insert user profile (this will be handled by Supabase triggers in production)
        profile_response = supabase.table("users").insert(user_profile).execute()
        
        return UserResponse(
            id=auth_response.user.id,
            email=user_data.email,
            name=user_data.name,
            created_at=auth_response.user.created_at
        )
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. Email might already be in use."
        )

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, supabase: Client = Depends(get_supabase_client)):
    """Login user"""
    try:
        # Authenticate with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Get user profile
        profile_response = supabase.table("users").select("*").eq("id", auth_response.user.id).execute()
        
        if not profile_response.data:
            # Create profile if it doesn't exist
            user_profile = {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "name": auth_response.user.user_metadata.get("name", "User")
            }
            supabase.table("users").insert(user_profile).execute()
            profile_data = user_profile
        else:
            profile_data = profile_response.data[0]
        
        user_response = UserResponse(
            id=profile_data["id"],
            email=profile_data["email"],
            name=profile_data["name"],
            created_at=auth_response.user.created_at
        )
        
        return Token(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            user=user_response
        )
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

@router.post("/logout")
async def logout(supabase: Client = Depends(get_supabase_client)):
    """Logout user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed"
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase_client)
):
    """Get current authenticated user"""
    try:
        # Verify token with Supabase
        user_response = supabase.auth.get_user(credentials.credentials)
        
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Get user profile
        profile_response = supabase.table("users").select("*").eq("id", user_response.user.id).execute()
        
        if not profile_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        profile_data = profile_response.data[0]
        
        return UserResponse(
            id=profile_data["id"],
            email=profile_data["email"],
            name=profile_data["name"],
            created_at=profile_data["created_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get current user error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@router.get("/me", response_model=UserResponse)
async def get_user_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get current user profile"""
    return current_user
