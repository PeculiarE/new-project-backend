/* Replace with your SQL commands */
ALTER TABLE users
DROP COLUMN country,
ADD COLUMN phone_number BIGINT NOT NULL,
ADD COLUMN otp_hash VARCHAR NOT NULL,
ADD COLUMN otp_hash_sent TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN is_confirmed VARCHAR DEFAULT 'false',
ADD COLUMN converted_username VARCHAR NOT NULL;