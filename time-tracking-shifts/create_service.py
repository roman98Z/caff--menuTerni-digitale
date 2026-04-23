#!/usr/bin/env python3
"""Standalone script: insert a new service, print id + plaintext passkey.

Usage:
    python create_service.py "Linc Caffè Zero"
    python create_service.py "Acme Srl" --algorithm greedy
"""

from __future__ import annotations

import argparse
import asyncio
import sys

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.config import settings
from app.models import Service
from app.security import generate_passkey, sha256_hash


async def main(name: str, algorithm: str | None) -> None:
    engine = create_async_engine(settings.database_url, future=True)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    passkey = generate_passkey()
    service = Service(
        name=name,
        passkey=sha256_hash(passkey),
        shifts_algorithm=algorithm,
    )

    async with Session() as session:
        session.add(service)
        await session.commit()
        await session.refresh(service)

    await engine.dispose()

    print("=" * 70)
    print(f"Service inserted")
    print("-" * 70)
    print(f"  id              : {service.id}")
    print(f"  name            : {service.name}")
    print(f"  shifts_algorithm: {service.shifts_algorithm or '(none)'}")
    print(f"  passkey (CLEAR) : {passkey}")
    print("=" * 70)
    print("IMPORTANT: store this passkey — only its SHA-256 hash is kept in DB.")


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a new service and print its plaintext passkey."
    )
    parser.add_argument("name", help="Service name.")
    parser.add_argument(
        "--algorithm",
        choices=("greedy", "ilp", "genetic"),
        default=None,
        help="Shift generation algorithm assigned to the service.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = _parse_args()
    try:
        asyncio.run(main(args.name, args.algorithm))
    except Exception as exc:  # pragma: no cover
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
