from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


# ── Interview Phase ──
class InterviewPhase(str, Enum):
    intro = "intro"
    scenario_a = "scenario_a"
    scenario_b = "scenario_b"
    scenario_c = "scenario_c"
    closing = "closing"


# ── Request Schemas ──
class InterviewStartRequest(BaseModel):
    """Start a new interview session."""
    candidate_name: str = Field(..., description="候補者の名前")
    resume_text: Optional[str] = Field(None, description="レジュメのテキスト（任意）")
    desired_position: str = Field(default="ホールスタッフ", description="希望職種")


class InterviewRespondRequest(BaseModel):
    """Send user response and get AI reply."""
    session_id: str = Field(..., description="セッションID")
    user_message: str = Field(..., description="ユーザーの発話テキスト")


class InterviewEvaluateRequest(BaseModel):
    """Evaluate an entire interview session."""
    session_id: str = Field(..., description="セッションID")


# ── Response Schemas ──
class AIMessage(BaseModel):
    text: str
    phase: InterviewPhase
    is_phase_transition: bool = False


class InterviewStartResponse(BaseModel):
    session_id: str
    ai_message: AIMessage
    total_phases: int = 5


class InterviewRespondResponse(BaseModel):
    ai_message: AIMessage
    is_complete: bool = False


class ScoreDetail(BaseModel):
    category: str
    score: float = Field(..., ge=0, le=5)
    comment: str


class AudioHighlight(BaseModel):
    label: str
    type: str  # "best" or "issue"
    transcript: str
    feedback: str


class OnboardingItem(BaseModel):
    priority: str  # "high", "medium", "low"
    category: str
    advice: str


class EvaluationReport(BaseModel):
    overall_score: float = Field(..., ge=0, le=5)
    rank: str  # A-E
    ai_comment: str
    scores: list[ScoreDetail]
    highlights: list[AudioHighlight]
    onboarding_advice: list[OnboardingItem]


class InterviewEvaluateResponse(BaseModel):
    session_id: str
    report: EvaluationReport


# ── Resume Schemas ──
class ResumeParseResponse(BaseModel):
    text: str
    summary: str
    name: Optional[str] = None
    nationality: Optional[str] = None
