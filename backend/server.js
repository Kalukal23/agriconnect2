require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// IMPORTANT: Railway provides PORT dynamically
const PORT = process.env.PORT || 5000;

// PostgreSQL Connection Pool (Neon requires SSL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend is running!',
    timestamp: new Date()
  });
});

// Test Database Connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connected!',
      time: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Market Prices Route
app.get('/api/market/prices', async (req, res) => {
  try {
    const { crop, region, search } = req.query;

    let query = 'SELECT id, crop, region, market, price, unit, change_percent AS change, trend, last_updated AS "lastUpdated" FROM market_prices WHERE 1=1';
    const params = [];

    if (crop && crop !== "all") {
      params.push(crop);
      query += ` AND crop = $${params.length}`;
    }

    if (region && region !== "all") {
      params.push(region);
      query += ` AND region = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (crop ILIKE $${params.length} OR region ILIKE $${params.length} OR market ILIKE $${params.length})`;
    }

    query += ' ORDER BY crop, region';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch market prices',
      details: error.message
    });
  }
});

// Global Error Handler (Good Practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server (Bind to 0.0.0.0 for Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});

module.exports = app;