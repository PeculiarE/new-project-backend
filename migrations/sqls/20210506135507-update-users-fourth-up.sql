ALTER TABLE users
DROP COLUMN IF EXISTS otp_hash_sent,
ADD COLUMN confirmation_token VARCHAR NOT NULL;