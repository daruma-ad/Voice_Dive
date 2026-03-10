/**
 * VoiceDive Next.js API Client
 * FastAPI Backendとの通信を担当
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AIMessage {
    text: string;
    phase: string;
    is_phase_transition: boolean;
}

export interface InterviewStartResponse {
    session_id: string;
    ai_message: AIMessage;
    total_phases: number;
}

export interface InterviewRespondResponse {
    ai_message: AIMessage;
    is_complete: boolean;
}

export interface ScoreDetail {
    category: string;
    score: number;
    comment: string;
}

export interface AudioHighlight {
    label: string;
    type: 'best' | 'issue';
    transcript: string;
    feedback: string;
}

export interface OnboardingItem {
    priority: 'high' | 'medium' | 'low';
    category: string;
    advice: string;
}

export interface EvaluationReport {
    overall_score: number;
    rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
    ai_comment: string;
    scores: ScoreDetail[];
    highlights: AudioHighlight[];
    onboarding_advice: OnboardingItem[];
}

export interface InterviewEvaluateResponse {
    session_id: string;
    report: EvaluationReport;
}

export interface ResumeParseResponse {
    text: string;
    summary: string;
    name?: string | null;
    nationality?: string | null;
}

/**
 * PDF/テキストファイルの解析
 */
export async function parseResume(file: File): Promise<ResumeParseResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/resume/parse`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'レジュメの解析に失敗しました');
    }

    return res.json();
}

/**
 * 面接セッション開始
 */
export async function startInterview(
    candidateName: string,
    resumeText?: string,
    desiredPosition: string = 'ホールスタッフ'
): Promise<InterviewStartResponse> {
    const res = await fetch(`${API_BASE_URL}/interview/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            candidate_name: candidateName,
            resume_text: resumeText || null,
            desired_position: desiredPosition,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || '面接の開始に失敗しました');
    }

    return res.json();
}

/**
 * 面接への応答（ユーザー発話送信）
 */
export async function respondToInterview(
    sessionId: string,
    userMessage: string
): Promise<InterviewRespondResponse> {
    const res = await fetch(`${API_BASE_URL}/interview/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            user_message: userMessage,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || '応答の送信に失敗しました');
    }

    return res.json();
}

/**
 * 面接の評価実行
 */
export async function evaluateInterview(
    sessionId: string
): Promise<InterviewEvaluateResponse> {
    const res = await fetch(`${API_BASE_URL}/interview/evaluate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || '評価の取得に失敗しました');
    }

    return res.json();
}
