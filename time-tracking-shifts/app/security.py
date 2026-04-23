"""Hashing and password/passkey generation helpers."""

import hashlib
import hmac
import secrets
import string


SPECIAL_CHARS = "!@#$%^&*"


def sha256_hash(value: str) -> str:
    """Return the hex SHA-256 digest of ``value``."""
    if value is None:
        raise ValueError("Cannot hash None value")
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def verify_hash(plain: str, hashed: str) -> bool:
    """Constant-time comparison of SHA-256 digest of ``plain`` against ``hashed``."""
    if plain is None or hashed is None:
        return False
    return hmac.compare_digest(sha256_hash(plain), hashed)


def generate_password(length: int = 8) -> str:
    """
    Generate an alphanumeric password of ``length`` characters with at least one
    uppercase letter and one special character.
    """
    if length < 4:
        raise ValueError("length must be >= 4")

    rng = secrets.SystemRandom()
    alphabet = string.ascii_letters + string.digits

    while True:
        chars = [
            secrets.choice(string.ascii_uppercase),
            secrets.choice(SPECIAL_CHARS),
        ]
        chars += [secrets.choice(alphabet) for _ in range(length - 2)]
        rng.shuffle(chars)
        password = "".join(chars)

        if (
            any(c.isupper() for c in password)
            and any(c in SPECIAL_CHARS for c in password)
            and len(password) == length
        ):
            return password


def generate_passkey(nbytes: int = 32) -> str:
    """Generate a URL-safe random passkey string."""
    return secrets.token_urlsafe(nbytes)
