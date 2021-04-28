/* Replace with your SQL commands */
ALTER TABLE users
ADD COLUMN password_reset_token_sent TIMESTAMPTZ,
ADD COLUMN is_password_reset_confirmed BOOLEAN DEFAULT false;