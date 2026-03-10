"""Resume Parsing API Router."""

import io
from fastapi import APIRouter, HTTPException, UploadFile, File

from models.schemas import ResumeParseResponse
from services.gemini_service import gemini_service

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    """Parse resume PDF/text and extract structured data."""

    # Validate file
    allowed_types = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"サポートされていないファイル形式です: {file.content_type}。PDF, TXT, DOCファイルをアップロードしてください。",
        )

    # Max 10MB
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="ファイルサイズは10MB以内にしてください。")

    try:
        text = extract_text(contents, file.content_type or "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"テキスト抽出に失敗しました: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="テキストを抽出できませんでした。")

    # Summarize with Gemini
    try:
        summary_data = gemini_service.summarize_resume(text)
        return ResumeParseResponse(
            text=text[:3000],
            summary=summary_data.get("summary", ""),
            name=summary_data.get("name"),
            nationality=summary_data.get("nationality"),
        )
    except Exception as e:
        # Return raw text even if summarization fails
        return ResumeParseResponse(
            text=text[:3000],
            summary="レジュメの要約に失敗しました。",
        )


def extract_text(contents: bytes, content_type: str) -> str:
    """Extract text from file contents based on content type."""

    if content_type == "text/plain":
        # Try UTF-8 first, then Shift_JIS for Japanese resumes
        for encoding in ["utf-8", "shift_jis", "euc-jp", "iso-2022-jp"]:
            try:
                return contents.decode(encoding)
            except UnicodeDecodeError:
                continue
        return contents.decode("utf-8", errors="replace")

    if content_type == "application/pdf":
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(io.BytesIO(contents))
            text_parts = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            return "\n".join(text_parts)
        except ImportError:
            raise ValueError("PyPDF2がインストールされていません。pip install PyPDF2 を実行してください。")

    # For DOC/DOCX - basic text extraction
    return contents.decode("utf-8", errors="replace")
