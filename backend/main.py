"""
VoiceDive Backend API
FastAPI application for AI-powered interview processing.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from routers import interview, resume

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="外国人求職者の日本語接客スキルを評価するAI面接バックエンドAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(interview.router)
app.include_router(resume.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "VoiceDive API",
        "status": "running",
        "gemini_configured": settings.gemini_api_key != "" and settings.gemini_api_key != "your-gemini-api-key",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
