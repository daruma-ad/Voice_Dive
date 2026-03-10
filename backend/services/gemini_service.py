"""
Gemini API Service for VoiceDive Interview AI.
Handles interview conversation generation and evaluation report creation.
"""

import json
import uuid
from typing import Optional

import google.generativeai as genai

from config import get_settings
from models.schemas import (
    InterviewPhase,
    AIMessage,
    EvaluationReport,
    ScoreDetail,
    AudioHighlight,
    OnboardingItem,
)

# ── In-memory session store ──
_sessions: dict[str, dict] = {}

# ── System Prompts ──

INTERVIEW_SYSTEM_PROMPT = """あなたはVoiceDiveのAI面接官「ミナ」です。飲食店で働きたい外国人求職者の日本語接客スキルを評価する面接を行います。

## あなたの性格
- 親しみやすく、温かい話し方
- 緊張をほぐすような声かけ
- 明確で簡潔な指示

## 面接のフロー（5フェーズ）
1. **intro**: 自己紹介フェーズ。候補者の名前、来日期間、飲食店経験を聞く（2-3往復）
2. **scenario_a**: ロールプレイ「オーダー取り」。お客様役として、イレギュラーな注文（アレルギー対応、メニューにない要望など）を含む（2-3往復）
3. **scenario_b**: ロールプレイ「クレーム対応」。料理が遅い、注文と違うなどの怒りのお客様役（2-3往復）
4. **scenario_c**: ロールプレイ「常連客対応」。関西弁混じりの常連客として、おすすめを聞いたり雑談する（1-2往復）
5. **closing**: まとめ。お疲れ様メッセージと面接終了の案内（1往復）

## ルール
- 各フェーズは指定の往復数で切り替え
- フェーズ切り替え時は「それでは次のシナリオに移ります」のような導入文を入れる
- お客様役の時は自然な日本語で話す（敬語とカジュアルを使い分け）
- 評価は行わず、自然な会話のみ行う
- レスポンスはJSON形式で返す

## レスポンス形式
必ず以下のJSON形式で返してください:
```json
{
  "text": "AIの発話テキスト",
  "phase": "現在のフェーズID",
  "is_phase_transition": false,
  "is_complete": false
}
```
"""

EVALUATION_SYSTEM_PROMPT = """あなたはVoiceDiveの評価エキスパートです。飲食店面接の会話ログを分析し、候補者の日本語接客スキルを評価してください。

## 評価軸（各5.0点満点）
1. **流暢さ (fluency)**: 発話の自然さ、言い淀みの少なさ
2. **敬語力 (keigo)**: 尊敬語・謙譲語・丁寧語の使い分け
3. **語彙力 (vocabulary)**: 接客に必要な語彙の豊富さ
4. **ホスピタリティ (hospitality)**: お客様への気配り、提案力
5. **臨機応変さ (adaptability)**: イレギュラーな状況への対応力

## ランク基準
- A: 4.0以上 — 即戦力
- B: 3.5-3.9 — 短期研修で即戦力
- C: 3.0-3.4 — 研修が必要
- D: 2.5-2.9 — かなりの研修が必要
- E: 2.4以下 — 現時点での採用は難しい

## 出力形式
必ず以下のJSON形式で返してください:
```json
{
  "overall_score": 3.8,
  "rank": "B",
  "ai_comment": "総合評価コメント（3-4文）",
  "scores": [
    {"category": "流暢さ", "score": 3.9, "comment": "コメント"},
    {"category": "敬語力", "score": 3.7, "comment": "コメント"},
    {"category": "語彙力", "score": 3.6, "comment": "コメント"},
    {"category": "ホスピタリティ", "score": 4.0, "comment": "コメント"},
    {"category": "臨機応変さ", "score": 3.8, "comment": "コメント"}
  ],
  "highlights": [
    {"label": "正確なオーダー復唱", "type": "best", "transcript": "該当部分を引用", "feedback": "良かった点の説明"},
    {"label": "クレーム時の対応の遅れ", "type": "issue", "transcript": "該当部分を引用", "feedback": "改善点の説明"}
  ],
  "onboarding_advice": [
    {"priority": "high", "category": "敬語強化", "advice": "具体的なアドバイス"},
    {"priority": "medium", "category": "語彙力", "advice": "具体的なアドバイス"}
  ]
}
```
"""


class GeminiService:
    """Gemini API wrapper for interview AI and evaluation."""

    def __init__(self):
        settings = get_settings()
        self._api_key = settings.gemini_api_key
        self._model_name = settings.gemini_model
        self._is_configured = bool(self._api_key and self._api_key != "your-gemini-api-key")

        if self._is_configured:
            genai.configure(api_key=self._api_key)

    @property
    def is_configured(self) -> bool:
        return self._is_configured

    def start_session(
        self,
        candidate_name: str,
        resume_text: Optional[str] = None,
        desired_position: str = "ホールスタッフ",
    ) -> tuple[str, AIMessage]:
        """Start a new interview session and return the first AI message."""
        session_id = str(uuid.uuid4())[:8]

        context = f"候補者名: {candidate_name}\n希望職種: {desired_position}"
        if resume_text:
            context += f"\n\nレジュメ概要:\n{resume_text[:500]}"

        if not self._is_configured:
            return self._demo_start(session_id, candidate_name)

        model = genai.GenerativeModel(
            self._model_name,
            system_instruction=INTERVIEW_SYSTEM_PROMPT,
        )

        chat = model.start_chat(history=[])

        prompt = f"""面接を開始してください。
{context}

自己紹介フェーズ(intro)の最初のAIメッセージをJSON形式で返してください。"""

        response = chat.send_message(prompt)
        result = self._parse_response(response.text)

        _sessions[session_id] = {
            "chat": chat,
            "candidate_name": candidate_name,
            "messages": [{"speaker": "ai", "text": result["text"], "phase": result["phase"]}],
            "current_phase": result["phase"],
        }

        return session_id, AIMessage(
            text=result["text"],
            phase=result["phase"],
            is_phase_transition=False,
        )

    def respond(self, session_id: str, user_message: str) -> tuple[AIMessage, bool]:
        """Process user message and return AI response."""
        if session_id not in _sessions:
            if not self._is_configured:
                return self._demo_respond(session_id, user_message)
            raise ValueError(f"Session {session_id} not found")

        session = _sessions[session_id]

        # Demo mode session (chat is None)
        if session.get("chat") is None:
            return self._demo_respond(session_id, user_message)

        session["messages"].append({
            "speaker": "user",
            "text": user_message,
            "phase": session["current_phase"],
        })

        prompt = f"""ユーザーの発話: 「{user_message}」

現在のフェーズ: {session['current_phase']}
これまでの会話回数: {len([m for m in session['messages'] if m['speaker'] == 'user'])}

次のAIの返答をJSON形式で返してください。フェーズの切り替えが必要であれば、is_phase_transitionをtrueにし、phaseを次のフェーズに更新してください。面接が完了した場合はis_completeをtrueにしてください。"""

        response = session["chat"].send_message(prompt)
        result = self._parse_response(response.text)

        is_complete = result.get("is_complete", False)

        session["messages"].append({
            "speaker": "ai",
            "text": result["text"],
            "phase": result["phase"],
        })
        session["current_phase"] = result["phase"]

        return AIMessage(
            text=result["text"],
            phase=result["phase"],
            is_phase_transition=result.get("is_phase_transition", False),
        ), is_complete

    def evaluate(self, session_id: str) -> EvaluationReport:
        """Generate evaluation report from interview conversation log."""
        if session_id not in _sessions:
            if not self._is_configured:
                return self._demo_evaluate()
            raise ValueError(f"Session {session_id} not found")

        session = _sessions[session_id]

        # Demo mode session
        if session.get("chat") is None:
            return self._demo_evaluate()
        conversation_log = "\n".join(
            f"{'AI' if m['speaker'] == 'ai' else '候補者'} [{m['phase']}]: {m['text']}"
            for m in session["messages"]
        )

        model = genai.GenerativeModel(
            self._model_name,
            system_instruction=EVALUATION_SYSTEM_PROMPT,
        )

        prompt = f"""以下の面接会話ログを分析し、評価レポートをJSON形式で生成してください。

候補者名: {session['candidate_name']}

=== 会話ログ ===
{conversation_log}
===============

JSON形式で評価レポートを返してください。"""

        response = model.generate_content(prompt)
        result = self._parse_response(response.text)

        return EvaluationReport(
            overall_score=result["overall_score"],
            rank=result["rank"],
            ai_comment=result["ai_comment"],
            scores=[ScoreDetail(**s) for s in result["scores"]],
            highlights=[AudioHighlight(**h) for h in result["highlights"]],
            onboarding_advice=[OnboardingItem(**o) for o in result["onboarding_advice"]],
        )

    def summarize_resume(self, text: str) -> dict:
        """Summarize resume text using Gemini."""
        if not self._is_configured:
            return {
                "summary": "レジュメの要約（デモモード）: 飲食店でのホールスタッフ経験あり。",
                "name": None,
                "nationality": None,
            }

        model = genai.GenerativeModel(self._model_name)
        prompt = f"""以下のレジュメのテキストを分析し、JSON形式で返してください:
```json
{{
  "summary": "レジュメの要約（3-4文）",
  "name": "候補者名（わかれば）",
  "nationality": "国籍（わかれば）"
}}
```

=== レジュメ ===
{text[:2000]}
"""
        response = model.generate_content(prompt)
        return self._parse_response(response.text)

    # ── Private Methods ──

    def _parse_response(self, text: str) -> dict:
        """Extract JSON from Gemini response."""
        cleaned = text.strip()
        # Remove markdown code block if present
        if "```json" in cleaned:
            cleaned = cleaned.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned:
            cleaned = cleaned.split("```")[1].split("```")[0].strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Fallback: try to find JSON in text
            start = cleaned.find("{")
            end = cleaned.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(cleaned[start:end])
            raise ValueError(f"Cannot parse Gemini response as JSON: {text[:200]}")

    # ── Demo Mode Fallbacks ──

    def _demo_start(self, session_id: str, name: str) -> tuple[str, AIMessage]:
        msg = AIMessage(
            text=f"こんにちは！VoiceDive面接へようこそ。私はAI面接官のミナです。{name}さん、今日はリラックスして、普段の接客のように話してくださいね。まず、日本に来てどのくらいになりますか？飲食店での経験はありますか？",
            phase=InterviewPhase.intro,
            is_phase_transition=False,
        )
        _sessions[session_id] = {
            "chat": None,
            "candidate_name": name,
            "messages": [{"speaker": "ai", "text": msg.text, "phase": "intro"}],
            "current_phase": "intro",
            "demo_step": 0,
        }
        return session_id, msg

    def _demo_respond(self, session_id: str, user_message: str) -> tuple[AIMessage, bool]:
        demo_responses = [
            AIMessage(text="3年も日本にいらっしゃるんですね。素晴らしいです。それでは、実際の接客を想定したロールプレイを始めましょう。私がお客様役をしますね。――いらっしゃーい！3人なんだけど、テーブル空いてる？", phase=InterviewPhase.scenario_a, is_phase_transition=True),
            AIMessage(text="ありがとう。えーっと、ビール2つと、この「日替わり定食」ってどんなの？あと、友達が乳製品アレルギーなんだけど、グラタン以外でおすすめある？", phase=InterviewPhase.scenario_a, is_phase_transition=False),
            AIMessage(text="次のシナリオに移りましょう。お店がとても混雑している状況です。――すみません！30分も待ってるんですけど！料理まだ来ないんですか？もう帰ります！", phase=InterviewPhase.scenario_b, is_phase_transition=True),
            AIMessage(text="本当に5分で来るの？さっきも同じこと言ったよね。店長呼んでくれない？", phase=InterviewPhase.scenario_b, is_phase_transition=False),
            AIMessage(text="最後のシナリオです。――おっ、久しぶりやな！最近暑いからさっぱりしたもんが食べたいねんけど、なんかおすすめあるん？", phase=InterviewPhase.scenario_c, is_phase_transition=True),
            AIMessage(text="素晴らしい対応でした！本日の面接は以上です。お疲れ様でした。結果は採用担当者から後日ご連絡いたします。ありがとうございました！", phase=InterviewPhase.closing, is_phase_transition=True),
        ]
        step = _sessions.get(session_id, {}).get("demo_step", 0)
        if step >= len(demo_responses):
            return demo_responses[-1], True

        msg = demo_responses[step]
        if session_id in _sessions:
            _sessions[session_id]["demo_step"] = step + 1
            _sessions[session_id]["messages"].append({"speaker": "user", "text": user_message, "phase": _sessions[session_id]["current_phase"]})
            _sessions[session_id]["messages"].append({"speaker": "ai", "text": msg.text, "phase": msg.phase})
            _sessions[session_id]["current_phase"] = msg.phase

        is_complete = step >= len(demo_responses) - 1
        return msg, is_complete

    def _demo_evaluate(self) -> EvaluationReport:
        return EvaluationReport(
            overall_score=3.8,
            rank="B",
            ai_comment="全体的に丁寧な対応ができており、基本的な接客日本語力は十分です。特にオーダー取りでの復唱は正確でした。クレーム対応ではやや反応が遅い場面がありましたが、最終的に適切な提案ができていました。短期研修で即戦力になるでしょう。",
            scores=[
                ScoreDetail(category="流暢さ", score=3.9, comment="自然な発話ができており、大きな詰まりは見られない"),
                ScoreDetail(category="敬語力", score=3.7, comment="丁寧語は適切。謙譲語の使い分けにやや課題"),
                ScoreDetail(category="語彙力", score=3.6, comment="基本的な接客語彙は十分。専門用語の理解を深めたい"),
                ScoreDetail(category="ホスピタリティ", score=4.0, comment="お客様への気配りと提案力が高い"),
                ScoreDetail(category="臨機応変さ", score=3.8, comment="アレルギー対応など臨機応変に対処できた"),
            ],
            highlights=[
                AudioHighlight(label="正確なオーダー復唱", type="best", transcript="生ビール2つとウーロン茶1つですね。本日のおすすめは旬のブリの照り焼き定食です。", feedback="注文内容を正確に復唱し、おすすめも的確に案内できている"),
                AudioHighlight(label="クレーム対応の初動", type="issue", transcript="えーと...少々お待ちください...確認します...", feedback="クレーム対応の初動でやや躊躇が見られた。即座にお詫びの言葉を入れるとよい"),
            ],
            onboarding_advice=[
                OnboardingItem(priority="high", category="クレーム対応", advice="クレーム時の初動対応（まずお詫び→状況確認→解決策提示）のパターンを練習する"),
                OnboardingItem(priority="medium", category="敬語強化", advice="謙譲語（参ります、申し上げます等）の使用場面を増やす"),
                OnboardingItem(priority="low", category="メニュー知識", advice="アレルギー対応と代替メニューの提案パターンを覚える"),
            ],
        )


# Singleton
gemini_service = GeminiService()
