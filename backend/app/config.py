from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite:///./heritage.db"
    cors_origins: str = "http://localhost:3000"
    storage_mode: str = "local"
    storage_dir: str = "./data"
    max_upload_mb: int = 12
    openai_api_key: str | None = None
    vision_model: str = "gpt-5.6-luna"
    image_model: str = "gpt-image-2"
    enable_generative_images: bool = False
    open_meteo_enabled: bool = True
    aws_s3_bucket: str | None = None
    aws_region: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)

    @property
    def normalized_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = "postgresql+psycopg://" + url[len("postgres://"):]
        elif url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url[len("postgresql://"):]
        return url

    @property
    def cors_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()
