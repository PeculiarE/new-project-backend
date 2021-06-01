/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  dob VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  password_reset_token VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
