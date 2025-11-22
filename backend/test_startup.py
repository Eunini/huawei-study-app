"""
Simple test script to check if the FastAPI app can start
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing imports...")
    from app.config import settings
    print("✅ Config imported successfully")
    
    from app.models import User, ODFSModule
    print("✅ Models imported successfully")
    
    from app.database import get_db
    print("✅ Database imported successfully") 
    
    from app.routes import auth, ai, odfs
    print("✅ Routes imported successfully")
    
    from app.main import app
    print("✅ FastAPI app imported successfully")
    
    print("\n🎉 All imports successful! You can now run:")
    print("python -m uvicorn app.main:app --reload --port 8000")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please check the error and fix dependencies")
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please check the configuration")