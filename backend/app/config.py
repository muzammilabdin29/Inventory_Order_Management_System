from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings, loaded from environment variables / .env file.
    Never hardcode secrets here -- this only defines defaults and types.
    """

    database_url: str = "postgresql://postgres:postgres@localhost:5432/inventory_db"
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
