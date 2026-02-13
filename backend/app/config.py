from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    admin_username: str = "admin"
    admin_password: str = "change_me"
    jwt_secret: str = "super-secret-key"
    cors_origins: str = "http://localhost:5173"
    database_url: str = "sqlite:///./blog.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
