"""Async SQLAlchemy engine / session factory + base declarative class."""

from typing import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from .config import settings


class Base(DeclarativeBase):
    """Shared declarative base for every ORM model."""


engine: AsyncEngine = create_async_engine(
    settings.database_url,
    echo=settings.app_debug,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency yielding an async session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
