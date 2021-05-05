/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS transaction_history (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    -- transactions UUID[] NOT NULL UNIQUE REFERENCES transactions(id) ON DELETE CASCADE,
    transactions UUID[] NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);