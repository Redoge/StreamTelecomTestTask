-- Встановлення TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Встановлення розширення uuid-ossp для генерації UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Створення таблиці користувачів
CREATE TABLE IF NOT EXISTS users
(
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(15)  NOT NULL UNIQUE,
    created_at   TIMESTAMPTZ      DEFAULT NOW(),
    updated_at   TIMESTAMPTZ     DEFAULT NOW()
);

-- Створення таблиці токенів авторизації
CREATE TABLE IF NOT EXISTS auth_tokens
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users (id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ      DEFAULT NOW()
);

-- Створення таблиці подій дзвінків з додатковими полями caller_id та recipient_id
CREATE TABLE IF NOT EXISTS call_events
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type        VARCHAR(255) NOT NULL,
    channel           VARCHAR(255),
    caller_id_num     VARCHAR(50),
    connected_line_num VARCHAR(50),
    caller_id         VARCHAR(50),
    recipient_id      VARCHAR(50),
    unique_id         VARCHAR(100),
    linked_id         VARCHAR(100),
    cause             VARCHAR(100),
    cause_txt         VARCHAR(255),
    context           VARCHAR(100),
    exten             VARCHAR(100),
    channel_state     VARCHAR(50),
    channel_state_desc VARCHAR(100),
    timestamp         TIMESTAMPTZ NOT NULL,
    raw_data          JSONB,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Створення гіпертаблиці для подій дзвінків з використанням TimescaleDB
SELECT create_hypertable('call_events', 'timestamp');

-- Індекси для таблиць
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users (phone_number);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_call_events_unique_id ON call_events (unique_id);
CREATE INDEX IF NOT EXISTS idx_call_events_linked_id ON call_events (linked_id);
CREATE INDEX IF NOT EXISTS idx_call_events_caller_id ON call_events (caller_id);
CREATE INDEX IF NOT EXISTS idx_call_events_recipient_id ON call_events (recipient_id);
CREATE INDEX IF NOT EXISTS idx_call_events_event_type ON call_events (event_type);