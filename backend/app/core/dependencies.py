from typing import Generator

from app.database import SessionLocal


def get_db() -> Generator:
    """
    FastAPI dependency that yields a DB session per-request and
    guarantees it's closed afterwards, even if the request raises.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
