-- Added schema for users and SMS subscribers to initialize the PostgreSQL database

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core user table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id UUID DEFAULT gen_random_uuid() UNIQUE,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  phone VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  location JSONB,
  preferred_language VARCHAR(20) DEFAULT 'en',
  account_status VARCHAR(20) DEFAULT 'ACTIVE',
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  role VARCHAR(30) DEFAULT 'Farmer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure existing installations have required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT gen_random_uuid();
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(20) DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE users ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(30) DEFAULT 'Farmer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Farmer profile extension (one-to-one)
CREATE TABLE IF NOT EXISTS farmers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_size VARCHAR(100),
  primary_crops JSONB,
  cooperative_id VARCHAR(100),
  education_level VARCHAR(100),
  device_type VARCHAR(100),
  alert_preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sms_subscribers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  phone VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens for authentication
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phone_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market pricing system
CREATE TABLE IF NOT EXISTS commodities (
  id SERIAL PRIMARY KEY,
  commodity_id UUID DEFAULT gen_random_uuid() UNIQUE,
  name_en VARCHAR(255) NOT NULL,
  name_am VARCHAR(255),
  category VARCHAR(100),
  unit VARCHAR(50),
  description TEXT,
  image_url TEXT,
  seasonality JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS markets (
  id SERIAL PRIMARY KEY,
  market_id UUID DEFAULT gen_random_uuid() UNIQUE,
  name VARCHAR(255) NOT NULL,
  location JSONB,
  region VARCHAR(100),
  operating_hours VARCHAR(255),
  contact_info JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prices (
  id SERIAL PRIMARY KEY,
  price_id UUID DEFAULT gen_random_uuid() UNIQUE,
  commodity_id INTEGER NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
  market_id INTEGER NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  price_value DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(255),
  confidence_score NUMERIC(3,2) DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts and notifications
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  alert_id UUID DEFAULT gen_random_uuid() UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  commodity_id INTEGER REFERENCES commodities(id) ON DELETE SET NULL,
  threshold_value NUMERIC(12,2) NOT NULL,
  threshold_type VARCHAR(20) NOT NULL,
  notification_channel VARCHAR(20) DEFAULT 'SMS',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  last_triggered TIMESTAMP,
  cooldown_hours INTEGER DEFAULT 6,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Extension content system
CREATE TABLE IF NOT EXISTS extension_content (
  id SERIAL PRIMARY KEY,
  content_id UUID DEFAULT gen_random_uuid() UNIQUE,
  title_en VARCHAR(255),
  title_am VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  content_type VARCHAR(20) DEFAULT 'ARTICLE',
  language VARCHAR(10) DEFAULT 'en',
  content_url TEXT,
  thumbnail_url TEXT,
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'DRAFT',
  publish_date TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  tags JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_ratings (
  id SERIAL PRIMARY KEY,
  rating_id UUID DEFAULT gen_random_uuid() UNIQUE,
  content_id INTEGER NOT NULL REFERENCES extension_content(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum / community
CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  post_id UUID DEFAULT gen_random_uuid() UNIQUE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags JSONB,
  view_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  is_question BOOLEAN DEFAULT FALSE,
  is_answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id SERIAL PRIMARY KEY,
  reply_id UUID DEFAULT gen_random_uuid() UNIQUE,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_votes (
  id SERIAL PRIMARY KEY,
  vote_id UUID DEFAULT gen_random_uuid() UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_subscriptions (
  id SERIAL PRIMARY KEY,
  subscription_id UUID DEFAULT gen_random_uuid() UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  notification_type VARCHAR(20) DEFAULT 'IN_APP',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SMS messages store
CREATE TABLE IF NOT EXISTS sms_messages (
  id SERIAL PRIMARY KEY,
  message_id UUID DEFAULT gen_random_uuid() UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  phone_number VARCHAR(50) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  error_code VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace products
CREATE TABLE IF NOT EXISTS marketplace_products (
  id SERIAL PRIMARY KEY,
  product_id UUID DEFAULT gen_random_uuid() UNIQUE,
  seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  category VARCHAR(100),
  quantity INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
