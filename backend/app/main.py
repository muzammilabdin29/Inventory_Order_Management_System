from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.core.exceptions import (
    DuplicateException,
    InsufficientStockException,
    NotFoundException,
    ValidationException,
)
from app.database import Base, engine
from app.routers import customers, dashboard, orders, products

# Creates tables on startup if they don't exist yet. For anything beyond
# local/dev use, Alembic migrations (see /backend/alembic) are the
# production-correct path -- this is a convenience fallback only.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory & Order Management API",
    description="REST API for managing products, customers, and orders.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Inventory & Order Management API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# --- Centralized error handling -------------------------------------------
# Business-rule exceptions raised anywhere in crud/ are translated here into
# proper HTTP status codes, instead of routers having to catch them one by one.

@app.exception_handler(NotFoundException)
def handle_not_found(request: Request, exc: NotFoundException):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(DuplicateException)
def handle_duplicate(request: Request, exc: DuplicateException):
    return JSONResponse(status_code=409, content={"detail": exc.message})


@app.exception_handler(InsufficientStockException)
def handle_insufficient_stock(request: Request, exc: InsufficientStockException):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(ValidationException)
def handle_validation(request: Request, exc: ValidationException):
    return JSONResponse(status_code=400, content={"detail": exc.message})


@app.exception_handler(RequestValidationError)
def handle_request_validation(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})
