require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function initDB() {
    try {
        console.log("Reading schema.sql...");
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing schema...");
        await pool.query(schema);
        console.log("Schema created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to initialize DB:", err);
        process.exit(1);
    }
}

initDB();
