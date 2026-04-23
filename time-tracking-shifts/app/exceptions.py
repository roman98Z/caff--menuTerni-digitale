"""Custom exceptions + FastAPI handlers."""

import logging
from typing import Any, Dict

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

logger = logging.getLogger(__name__)


class AppError(Exception):
    status_code: int = 400
    default_detail: str = "Application error"

    def __init__(self, detail: str | None = None, extra: Dict[str, Any] | None = None):
        super().__init__(detail or self.default_detail)
        self.detail = detail or self.default_detail
        self.extra = extra or {}


class AuthError(AppError):
    status_code = 401
    default_detail = "Invalid credentials"


class ForbiddenError(AppError):
    status_code = 403
    default_detail = "Forbidden"


class NotFoundError(AppError):
    status_code = 404
    default_detail = "Resource not found"


class ConflictError(AppError):
    status_code = 409
    default_detail = "Conflict"


class ValidationError(AppError):
    status_code = 422
    default_detail = "Validation error"


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _app_error(_: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, **exc.extra},
        )

    @app.exception_handler(IntegrityError)
    async def _integrity(_: Request, exc: IntegrityError):
        logger.warning("IntegrityError: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": "Database integrity error", "error": str(exc.orig)},
        )

    @app.exception_handler(SQLAlchemyError)
    async def _sqlalchemy(_: Request, exc: SQLAlchemyError):
        logger.exception("SQLAlchemy error")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Database error"},
        )
