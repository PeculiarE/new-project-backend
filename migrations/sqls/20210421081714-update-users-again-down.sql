/* Replace with your SQL commands */
ALTER TABLE users
DROP COLUMN password_reset_token_sent,
DROP COLUMN is_password_reset_confirmed;