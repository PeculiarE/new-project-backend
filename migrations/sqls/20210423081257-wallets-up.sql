/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance BIGINT DEFAULT 0,
  pin_hash VARCHAR NOT NULL,
  pin_reset_token VARCHAR,
  pin_reset_token_sent TIMESTAMPTZ,
  is_pin_reset_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);