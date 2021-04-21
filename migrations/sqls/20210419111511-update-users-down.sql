/* Replace with your SQL commands */
ALTER TABLE users
ADD COLUMN country VARCHAR NOT NULL,
DROP COLUMN otp_hash,
DROP COLUMN otp_hash_sent,
DROP COLUMN phone_number,
DROP COLUMN is_confirmed,
DROP COLUMN converted_username;