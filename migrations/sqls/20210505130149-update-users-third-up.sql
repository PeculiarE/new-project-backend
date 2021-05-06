/* Replace with your SQL commands */
ALTER TABLE users
DROP COLUMN IF EXISTS password_reset_token_sent,
DROP COLUMN IF EXISTS is_password_reset_confirmed;