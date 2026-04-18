-- =====================================================================
-- FAAExaminations.com - PostgreSQL Schema
-- =====================================================================
-- Run this file once against an empty Postgres database, e.g.:
--   createdb faaexaminations
--   psql -d faaexaminations -f database/schema.sql
-- =====================================================================

DROP TABLE IF EXISTS exam_answers    CASCADE;
DROP TABLE IF EXISTS exam_results    CASCADE;
DROP TABLE IF EXISTS exam_sessions   CASCADE;
DROP TABLE IF EXISTS questions       CASCADE;
DROP TABLE IF EXISTS topics          CASCADE;
DROP TABLE IF EXISTS exams           CASCADE;
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS users           CASCADE;

-- ---------- users ----------------------------------------------------
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255)        NOT NULL,
    full_name       VARCHAR(120),
    role            VARCHAR(20)  NOT NULL DEFAULT 'student',   -- student | admin
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    subscription    VARCHAR(20)  NOT NULL DEFAULT 'free',      -- free | pro
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ---------- password_resets ------------------------------------------
CREATE TABLE password_resets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) UNIQUE NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- exams ----------------------------------------------------
-- Exam categories: PAR, IRA, CAX
CREATE TABLE exams (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(10)  UNIQUE NOT NULL,   -- PAR | IRA | CAX
    name            VARCHAR(120) NOT NULL,
    description     TEXT,
    time_limit      INTEGER      NOT NULL DEFAULT 150,   -- minutes
    num_questions   INTEGER      NOT NULL DEFAULT 60,
    passing_score   INTEGER      NOT NULL DEFAULT 70,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------- topics ---------------------------------------------------
CREATE TABLE topics (
    id          SERIAL PRIMARY KEY,
    exam_id     INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    name        VARCHAR(160) NOT NULL,
    slug        VARCHAR(160) NOT NULL,
    description TEXT,
    UNIQUE (exam_id, slug)
);

CREATE INDEX idx_topics_exam ON topics(exam_id);

-- ---------- questions ------------------------------------------------
CREATE TABLE questions (
    id              SERIAL PRIMARY KEY,
    exam_id         INTEGER NOT NULL REFERENCES exams(id)  ON DELETE CASCADE,
    topic_id        INTEGER          REFERENCES topics(id) ON DELETE SET NULL,
    question_text   TEXT    NOT NULL,
    choice_a        TEXT,
    choice_b        TEXT,
    choice_c        TEXT,
    choice_d        TEXT,
    correct_answer  CHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
    explanation     TEXT,
    image_url       VARCHAR(500),
    difficulty      VARCHAR(10) NOT NULL DEFAULT 'medium',  -- easy | medium | hard
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_exam    ON questions(exam_id);
CREATE INDEX idx_questions_topic   ON questions(topic_id);
CREATE INDEX idx_questions_active  ON questions(is_active);

-- ---------- exam_sessions --------------------------------------------
-- A session is one attempt; it can be in-progress or completed.
CREATE TABLE exam_sessions (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_id          INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    mode             VARCHAR(10) NOT NULL DEFAULT 'exam',   -- exam | study
    status           VARCHAR(15) NOT NULL DEFAULT 'in_progress', -- in_progress | completed | abandoned
    question_ids     INTEGER[]   NOT NULL,
    current_index    INTEGER     NOT NULL DEFAULT 0,
    flagged_ids      INTEGER[]   NOT NULL DEFAULT '{}',
    answers          JSONB       NOT NULL DEFAULT '{}'::jsonb,
    time_limit       INTEGER     NOT NULL DEFAULT 150,
    started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at     TIMESTAMPTZ,
    score            NUMERIC(5,2),
    passed           BOOLEAN
);

CREATE INDEX idx_sessions_user   ON exam_sessions(user_id);
CREATE INDEX idx_sessions_status ON exam_sessions(status);

-- ---------- exam_results ---------------------------------------------
CREATE TABLE exam_results (
    id             SERIAL PRIMARY KEY,
    session_id     INTEGER NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    user_id        INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    exam_id        INTEGER NOT NULL REFERENCES exams(id)  ON DELETE CASCADE,
    total_questions INTEGER NOT NULL,
    correct_count   INTEGER NOT NULL,
    score           NUMERIC(5,2) NOT NULL,
    passed          BOOLEAN NOT NULL,
    duration_sec    INTEGER NOT NULL,
    topic_breakdown JSONB   NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_results_user ON exam_results(user_id);
CREATE INDEX idx_results_exam ON exam_results(exam_id);

-- ---------- exam_answers ---------------------------------------------
-- Per-question record for analytics (optional detail rows).
CREATE TABLE exam_answers (
    id              SERIAL PRIMARY KEY,
    session_id      INTEGER NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id     INTEGER NOT NULL REFERENCES questions(id)    ON DELETE CASCADE,
    selected_answer CHAR(1),
    is_correct      BOOLEAN NOT NULL,
    answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_session ON exam_answers(session_id);
CREATE INDEX idx_answers_question ON exam_answers(question_id);

-- ---------- seed exam categories -------------------------------------
INSERT INTO exams (code, name, description, time_limit, num_questions, passing_score) VALUES
  ('PAR', 'Private Pilot Airplane (PAR)',
   'FAA written knowledge exam for the Private Pilot Airplane certificate.',
   150, 60, 70),
  ('IRA', 'Instrument Rating Airplane (IRA)',
   'FAA written knowledge exam for the Instrument Rating.',
   150, 60, 70),
  ('CAX', 'Commercial Pilot Airplane (CAX)',
   'FAA written knowledge exam for the Commercial Pilot certificate.',
   180, 100, 70);
