"""Interview API Router."""

from fastapi import APIRouter, HTTPException

from models.schemas import (
    InterviewStartRequest,
    InterviewStartResponse,
    InterviewRespondRequest,
    InterviewRespondResponse,
    InterviewEvaluateRequest,
    InterviewEvaluateResponse,
)
from services.gemini_service import gemini_service

router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.post("/start", response_model=InterviewStartResponse)
async def start_interview(request: InterviewStartRequest):
    """Start a new interview session."""
    try:
        session_id, ai_message = gemini_service.start_session(
            candidate_name=request.candidate_name,
            resume_text=request.resume_text,
            desired_position=request.desired_position,
        )
        return InterviewStartResponse(
            session_id=session_id,
            ai_message=ai_message,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"面接の開始に失敗しました: {str(e)}")


@router.post("/respond", response_model=InterviewRespondResponse)
async def respond_to_interview(request: InterviewRespondRequest):
    """Send user response and get AI reply."""
    try:
        ai_message, is_complete = gemini_service.respond(
            session_id=request.session_id,
            user_message=request.user_message,
        )
        return InterviewRespondResponse(
            ai_message=ai_message,
            is_complete=is_complete,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"応答の生成に失敗しました: {str(e)}")


@router.post("/evaluate", response_model=InterviewEvaluateResponse)
async def evaluate_interview(request: InterviewEvaluateRequest):
    """Generate evaluation report for a completed interview."""
    try:
        report = gemini_service.evaluate(session_id=request.session_id)
        return InterviewEvaluateResponse(
            session_id=request.session_id,
            report=report,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"評価レポートの生成に失敗しました: {str(e)}")
