"""FastAPI application entry point."""

import logging
import time

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .exceptions import register_exception_handlers
from .routers import (
    constraints,
    entries,
    preferences,
    services,
    shift_requirements,
    shift_templates,
    shifts,
    users,
)
from .utils import RateLimiter

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-7s %(name)s :: %(message)s",
)
logger = logging.getLogger("app")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        description=(
            "Backend per la timbratura entrata/uscita tramite geolocalizzazione "
            "e gestione turni per piccole e medie imprese."
        ),
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    rate_limiter = RateLimiter(
        max_requests=settings.rate_limit_per_minute, window_seconds=60
    )

    @app.middleware("http")
    async def _rate_limit_and_log(request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        if not rate_limiter.check(client_ip):
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded"},
            )
        started = time.monotonic()
        response = await call_next(request)
        elapsed_ms = (time.monotonic() - started) * 1000
        logger.info(
            "%s %s -> %s (%.1fms) ip=%s",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
            client_ip,
        )
        return response

    register_exception_handlers(app)

    app.include_router(services.router)
    app.include_router(users.router)
    app.include_router(entries.router)
    app.include_router(shifts.router)
    app.include_router(constraints.router)
    app.include_router(preferences.router)
    app.include_router(shift_templates.router)
    app.include_router(shift_requirements.router)

    @app.get("/health", tags=["health"])
    async def health():
        return {"status": "ok", "app": settings.app_name}

    return app


app = create_app()
