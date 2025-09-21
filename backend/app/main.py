from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, study, exam, results
from app.config import settings

# Create FastAPI app
app = FastAPI(
    title="Huawei ICT Cloud Track Study & Mock Exam API",
    description="API for Huawei ICT Cloud certification study and practice exams",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(study.router, prefix="/api/study", tags=["study"])
app.include_router(exam.router, prefix="/api/exam", tags=["exam"])
app.include_router(results.router, prefix="/api/results", tags=["results"])

@app.get("/")
async def root():
    return {"message": "Huawei ICT Cloud Track Study & Mock Exam API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
