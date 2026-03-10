from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Gemini API
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    # CORS
    cors_origins: str | list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://voice-dive.vercel.app",
        "*"
    ]

    # App
    app_name: str = "VoiceDive API"
    debug: bool = True

    class Config:
        env_file = ".env"
        env_prefix = "VOICEDIVE_"


@lru_cache
def get_settings() -> Settings:
    return Settings()
