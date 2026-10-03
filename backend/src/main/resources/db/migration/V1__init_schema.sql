-- =============================================
-- ExplainMyError Database Schema
-- V1 Initial Migration
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'USER',
    preferred_explanation_level VARCHAR(20) DEFAULT 'INTERMEDIATE',
    default_language VARCHAR(50) DEFAULT 'AUTO',
    theme       VARCHAR(20) DEFAULT 'DARK',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Error analyses table
CREATE TABLE IF NOT EXISTS error_analyses (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT REFERENCES users(id) ON DELETE CASCADE,
    language            VARCHAR(50),
    framework           VARCHAR(100),
    problem_type        VARCHAR(50),
    input_text          TEXT NOT NULL,
    expected_behavior   TEXT,
    explanation_level   VARCHAR(20) DEFAULT 'INTERMEDIATE',
    error_name          VARCHAR(255),
    severity            VARCHAR(20),
    confidence          DECIMAL(5,2),
    what_happened       TEXT,
    why_it_happened     TEXT,
    root_cause          TEXT,
    error_file          VARCHAR(500),
    error_line          INTEGER,
    error_location_description TEXT,
    suggested_fix_explanation  TEXT,
    suggested_fix_code         TEXT,
    original_code              TEXT,
    prevention          TEXT,
    status              VARCHAR(20) DEFAULT 'COMPLETED',
    mode                VARCHAR(20) DEFAULT 'ERROR_ANALYSIS',
    raw_ai_response     TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Probable causes table
CREATE TABLE IF NOT EXISTS probable_causes (
    id          BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES error_analyses(id) ON DELETE CASCADE,
    cause       TEXT NOT NULL,
    confidence  DECIMAL(5,2),
    rank        INTEGER NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Debugging steps table
CREATE TABLE IF NOT EXISTS debugging_steps (
    id          BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES error_analyses(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Alternative fixes table
CREATE TABLE IF NOT EXISTS alternative_fixes (
    id          BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES error_analyses(id) ON DELETE CASCADE,
    fix_type    VARCHAR(50),
    description TEXT NOT NULL,
    rank        INTEGER NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Related concepts table
CREATE TABLE IF NOT EXISTS related_concepts (
    id          BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES error_analyses(id) ON DELETE CASCADE,
    concept     VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Debug sessions table
CREATE TABLE IF NOT EXISTS debug_sessions (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    status      VARCHAR(20) DEFAULT 'ACTIVE',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Debug session entries table
CREATE TABLE IF NOT EXISTS session_entries (
    id              BIGSERIAL PRIMARY KEY,
    session_id      BIGINT NOT NULL REFERENCES debug_sessions(id) ON DELETE CASCADE,
    analysis_id     BIGINT REFERENCES error_analyses(id) ON DELETE SET NULL,
    step_number     INTEGER NOT NULL,
    step_status     VARCHAR(30) DEFAULT 'CURRENT',
    user_input      TEXT,
    ai_summary      TEXT,
    resolution_note TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Follow-up messages table
CREATE TABLE IF NOT EXISTS follow_up_messages (
    id          BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES error_analyses(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL,
    message     TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_analyses_user_id ON error_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_error_analyses_created_at ON error_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_analyses_language ON error_analyses(language);
CREATE INDEX IF NOT EXISTS idx_error_analyses_severity ON error_analyses(severity);
CREATE INDEX IF NOT EXISTS idx_probable_causes_analysis_id ON probable_causes(analysis_id);
CREATE INDEX IF NOT EXISTS idx_debugging_steps_analysis_id ON debugging_steps(analysis_id);
CREATE INDEX IF NOT EXISTS idx_debug_sessions_user_id ON debug_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_entries_session_id ON session_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_messages_analysis_id ON follow_up_messages(analysis_id);
