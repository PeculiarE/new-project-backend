CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  country VARCHAR NOT NULL,
  dob VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  password_reset_token VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- testing the table with a sample user
INSERT INTO users (id, first_name, last_name, email, country, dob, username, password_hash)
  VALUES ('77bfc6fb-dca8-4063-8bd9-c03f89aad61f','Peculiar', 'Erhis', 'perhis@gmail.com', 'Nigeria', '1996-04-26', 'UniqueGal', '7613t3478ubrft78yXS');
