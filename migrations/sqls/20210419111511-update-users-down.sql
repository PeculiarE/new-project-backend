/* Replace with your SQL commands */
ALTER TABLE users
DROP COLUMN IF EXISTS otp_hash,
DROP COLUMN IF EXISTS otp_hash_sent,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS is_confirmed,
DROP COLUMN IF EXISTS converted_username;