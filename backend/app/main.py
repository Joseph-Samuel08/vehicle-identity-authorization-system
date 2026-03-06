"""FastAPI application entry point."""

from contextlib import asynccontextmanager
import os

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine
from app.models import insurance_model, owner_model, vehicle_model
from app.routes.insurance_routes import router as insurance_router
from app.routes.owner_routes import router as owner_router
from app.routes.vehicle_routes import (
    authorization_router,
    vehicle_router,
)
from app.schemas.common_schema import HealthStatusResponse, SuccessResponse
from app.services.seed_service import seed_demo_data
from app.services.service_exceptions import ServiceError


OPENAPI_TAGS = [
    {
        "name": "Owners",
        "description": "Operations for registering and listing vehicle owners.",
    },
    {
        "name": "Vehicles",
        "description": "Operations for creating and viewing vehicle identity records.",
    },
    {
        "name": "Insurance",
        "description": "Operations for managing vehicle insurance policies.",
    },
    {
        "name": "Authorization",
        "description": "Operations for checking whether a vehicle is authorized.",
    },
    {
        "name": "System",
        "description": "Operational endpoints used to monitor service health.",
    },
]


def _get_allowed_origins() -> list[str]:
    """Return configured frontend origins for local development and demos."""
    configured_origins = os.getenv("CORS_ALLOW_ORIGINS", "")
    if configured_origins:
        return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]

    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Create database tables when the application starts."""
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
    yield


def _extract_error_message(detail: object) -> str:
    """Normalize error payloads into a readable message string."""
    if isinstance(detail, str):
        return detail
    if isinstance(detail, list) and detail:
        first_error = detail[0]
        if isinstance(first_error, dict):
            location = ".".join(str(part) for part in first_error.get("loc", []))
            message = first_error.get("msg", "Validation error.")
            return f"{location}: {message}" if location else message
    return "Request could not be processed."


app = FastAPI(
    title="Vehicle Identity Authorization System",
    lifespan=lifespan,
    openapi_tags=OPENAPI_TAGS,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_allowed_origins(),
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ServiceError)
async def service_exception_handler(_: Request, exc: ServiceError) -> JSONResponse:
    """Return service-layer errors in a consistent response envelope."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.message},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    """Return API errors in a consistent response envelope."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": _extract_error_message(exc.detail)},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Return request validation errors in a consistent response envelope."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"success": False, "message": _extract_error_message(exc.errors())},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    """Return unexpected server errors in a consistent response envelope."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": "Internal server error."},
    )


@app.get(
    "/health",
    response_model=SuccessResponse[HealthStatusResponse],
    status_code=status.HTTP_200_OK,
    tags=["System"],
    summary="Health check",
    description="Verify that the API server is running and ready to accept requests.",
)
def health_check() -> dict:
    """Return the current service health status."""
    return {
        "success": True,
        "data": {
            "status": "system operational",
            "service": "Vehicle Identity Authorization System",
        },
    }


app.include_router(owner_router)
app.include_router(vehicle_router)
app.include_router(authorization_router)
app.include_router(insurance_router)
