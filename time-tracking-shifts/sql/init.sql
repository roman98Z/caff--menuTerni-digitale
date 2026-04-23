-- Init schema for Time Tracking & Shifts
-- PostgreSQL 18 compatible
-- Use this script as an alternative to the Alembic migration.

BEGIN;

CREATE TABLE IF NOT EXISTS services (
    id               SERIAL PRIMARY KEY,
    name             TEXT NOT NULL,
    passkey          TEXT NOT NULL,
    shifts_algorithm TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id             SERIAL PRIMARY KEY,
    firstname      TEXT NOT NULL,
    lastname       TEXT NOT NULL,
    telephone      TEXT,
    email          TEXT UNIQUE,
    password_hash  TEXT NOT NULL,
    passkey        TEXT NOT NULL,
    service_id     INT REFERENCES services(id) ON DELETE CASCADE,
    allowed_geoloc BOOLEAN NOT NULL DEFAULT FALSE,
    active         BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS ix_users_service_id ON users(service_id);
CREATE INDEX IF NOT EXISTS ix_users_active     ON users(active);

CREATE TABLE IF NOT EXISTS entries (
    id       SERIAL PRIMARY KEY,
    user_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    geoloc   POINT,
    type     TEXT NOT NULL,
    CONSTRAINT ck_entries_type CHECK (type IN ('entry','exit'))
);
CREATE INDEX IF NOT EXISTS ix_entries_user_id  ON entries(user_id);
CREATE INDEX IF NOT EXISTS ix_entries_datetime ON entries(datetime);

CREATE TABLE IF NOT EXISTS shifts (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time   TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_shifts_user_id    ON shifts(user_id);
CREATE INDEX IF NOT EXISTS ix_shifts_start_time ON shifts(start_time);

CREATE TABLE IF NOT EXISTS shift_requirements (
    id             SERIAL PRIMARY KEY,
    start_time     TIMESTAMP NOT NULL,
    end_time       TIMESTAMP NOT NULL,
    required_count INT NOT NULL,
    service_id     INT REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_constraints (
    id                 SERIAL PRIMARY KEY,
    user_id            INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_hours_per_week INT,
    max_hours_per_day  INT,
    min_rest_hours     INT,
    unavailable_start  TIMESTAMP,
    unavailable_end    TIMESTAMP,
    constraint_type    TEXT,
    CONSTRAINT ck_user_constraints_type
        CHECK (constraint_type IS NULL OR constraint_type IN ('HARD','SOFT'))
);
CREATE INDEX IF NOT EXISTS ix_user_constraints_user_id ON user_constraints(user_id);

CREATE TABLE IF NOT EXISTS user_preferences (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_start TIME,
    preferred_end   TIME,
    preferred_days  INT[],
    weight          INT NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS ix_user_preferences_user_id ON user_preferences(user_id);

CREATE TABLE IF NOT EXISTS shift_templates (
    id         SERIAL PRIMARY KEY,
    service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time   TIME NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_shift_templates_service_id ON shift_templates(service_id);

COMMIT;
