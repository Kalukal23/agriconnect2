require('dotenv').config({ path: '.env.local' });
const { createUser } = require('./lib/db-mock.ts'); // Or write a plain JS version to avoid TS complications for a quick raw test

// Simple raw JS version to test the query directly
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    try {
        console.log('Testing insert with URL:', process.env.DATABASE_URL);
        const res = await pool.query(
            "INSERT INTO users (name, phone, password, region, farm_size, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            ['Test', '1234567890', 'pass', 'region', '10', 'en']
        );
        console.log('User created:', res.rows[0]);
    } catch (err) {
        console.error('Insert Error:', err.message);
    } finally {
        await pool.end();
    }
}
main();
