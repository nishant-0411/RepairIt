from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "RepairIt API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    SECRET_KEY: str = "changethis"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    OPENAI_API_KEY: str = ""

settings = Settings()