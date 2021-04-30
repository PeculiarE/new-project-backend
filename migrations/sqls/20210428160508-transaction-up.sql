/* Replace with your SQL commands */
CREATE TYPE transaction_type AS ENUM ('deposit', 'transfer');

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    transaction_type transaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
