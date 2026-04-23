"""Initial schema.

Revision ID: 0001
Revises:
Create Date: 2026-04-23

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "services",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("passkey", sa.Text(), nullable=False),
        sa.Column("shifts_algorithm", sa.Text(), nullable=True),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("firstname", sa.Text(), nullable=False),
        sa.Column("lastname", sa.Text(), nullable=False),
        sa.Column("telephone", sa.Text(), nullable=True),
        sa.Column("email", sa.Text(), nullable=True, unique=True),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column("passkey", sa.Text(), nullable=False),
        sa.Column(
            "service_id",
            sa.Integer(),
            sa.ForeignKey("services.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column("allowed_geoloc", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.create_index("ix_users_service_id", "users", ["service_id"])
    op.create_index("ix_users_active", "users", ["active"])

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS entries (
            id       SERIAL PRIMARY KEY,
            user_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            geoloc   POINT,
            type     TEXT NOT NULL,
            CONSTRAINT ck_entries_type CHECK (type IN ('entry','exit'))
        );
        """
    )
    op.create_index("ix_entries_user_id", "entries", ["user_id"])
    op.create_index("ix_entries_datetime", "entries", ["datetime"])

    op.create_table(
        "shifts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("start_time", sa.DateTime(timezone=False), nullable=False),
        sa.Column("end_time", sa.DateTime(timezone=False), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=False), server_default=sa.func.now()),
    )
    op.create_index("ix_shifts_user_id", "shifts", ["user_id"])
    op.create_index("ix_shifts_start_time", "shifts", ["start_time"])

    op.create_table(
        "shift_requirements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("start_time", sa.DateTime(timezone=False), nullable=False),
        sa.Column("end_time", sa.DateTime(timezone=False), nullable=False),
        sa.Column("required_count", sa.Integer(), nullable=False),
        sa.Column(
            "service_id",
            sa.Integer(),
            sa.ForeignKey("services.id", ondelete="CASCADE"),
            nullable=True,
        ),
    )

    op.create_table(
        "user_constraints",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("max_hours_per_week", sa.Integer(), nullable=True),
        sa.Column("max_hours_per_day", sa.Integer(), nullable=True),
        sa.Column("min_rest_hours", sa.Integer(), nullable=True),
        sa.Column("unavailable_start", sa.DateTime(timezone=False), nullable=True),
        sa.Column("unavailable_end", sa.DateTime(timezone=False), nullable=True),
        sa.Column("constraint_type", sa.String(length=4), nullable=True),
        sa.CheckConstraint(
            "constraint_type IS NULL OR constraint_type IN ('HARD','SOFT')",
            name="ck_user_constraints_type",
        ),
    )
    op.create_index("ix_user_constraints_user_id", "user_constraints", ["user_id"])

    op.create_table(
        "user_preferences",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("preferred_start", sa.Time(), nullable=True),
        sa.Column("preferred_end", sa.Time(), nullable=True),
        sa.Column("preferred_days", postgresql.ARRAY(sa.Integer()), nullable=True),
        sa.Column("weight", sa.Integer(), nullable=False, server_default="1"),
    )
    op.create_index("ix_user_preferences_user_id", "user_preferences", ["user_id"])

    op.create_table(
        "shift_templates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "service_id",
            sa.Integer(),
            sa.ForeignKey("services.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
    )
    op.create_index("ix_shift_templates_service_id", "shift_templates", ["service_id"])


def downgrade() -> None:
    op.drop_table("shift_templates")
    op.drop_table("user_preferences")
    op.drop_table("user_constraints")
    op.drop_table("shift_requirements")
    op.drop_table("shifts")
    op.drop_table("entries")
    op.drop_table("users")
    op.drop_table("services")
