-- Added schema for users and SMS subscribers to initialize the PostgreSQL database
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  farm_size VARCHAR(100),
  language VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sms_subscribers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
