require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const poolOptions = {
  connectionString: process.env.DATABASE_URL,
}

// Only enable SSL when connecting to a non-localhost host (e.g. deployed/postgres-as-a-service)
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
  poolOptions.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolOptions)
const bcrypt = require("bcryptjs")

async function initDB() {
    try {
        console.log("Reading schema.sql...");
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing schema...");
        await pool.query(schema);
        console.log("Schema created successfully!");

        // Seed a default user for initial access (if not already present)
        const defaultPhone = "+251900000000"
        const defaultPassword = "Password123!"
        const passwordHash = bcrypt.hashSync(defaultPassword, 10)

        const userResult = await pool.query(
            `INSERT INTO users (name, username, email, phone, password, password_hash, role)
             VALUES ($1, $1, $2, $3, $4, $4, $5)
             ON CONFLICT (phone) DO UPDATE
               SET username = EXCLUDED.username,
                   email = EXCLUDED.email,
                   name = EXCLUDED.name,
                   password = EXCLUDED.password,
                   password_hash = EXCLUDED.password_hash
             RETURNING id`,
            ["demo", "demo@agri.example", defaultPhone, passwordHash, "Farmer"],
        )

        const userId = userResult.rows[0].id

        // Seed sample content and forum data if missing
        const contentCheck = await pool.query("SELECT id FROM extension_content LIMIT 1")
        if (contentCheck.rows.length === 0) {
            await pool.query(
                `INSERT INTO extension_content (title_en, description, category, content_type, language, author_id, status, publish_date, tags)
                 VALUES ($1, $2, $3, 'ARTICLE', 'en', $4, 'PUBLISHED', NOW(), $5)`,
                [
                    "Best Practices for Teff Cultivation in Ethiopia",
                    "Learn the optimal techniques for growing teff, Ethiopia's staple grain crop.",
                    "Crop Management",
                    userId,
                    JSON.stringify(["teff", "cultivation", "planting"]),
                ],
            )
        }

        const postCheck = await pool.query("SELECT id FROM forum_posts LIMIT 1")
        if (postCheck.rows.length === 0) {
            await pool.query(
                `INSERT INTO forum_posts (author_id, title, content, category, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, NOW(), NOW())`,
                [
                    userId,
                    "What's the best time to harvest wheat?",
                    "I'm growing wheat for the first time and not sure when to harvest. The grains are turning yellow but still soft. Should I wait longer?",
                    "Harvesting",
                ],
            )
        }

        const productCheck = await pool.query("SELECT id FROM marketplace_products LIMIT 1")
        if (productCheck.rows.length === 0) {
            await pool.query(
                `INSERT INTO marketplace_products (seller_id, name, description, price, category, quantity, image_url, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
                [
                    userId,
                    "Teff Seeds - Premium Quality",
                    "High-quality teff seeds for planting. Yields excellent results in Ethiopian highlands.",
                    450,
                    "Seeds",
                    100,
                    "/teff-seeds.jpg",
                ],
            )
        }

        console.log("Seed data inserted (if it was missing)");
        process.exit(0);
    } catch (err) {
        console.error("Failed to initialize DB:", err);
        process.exit(1);
    }
}

initDB();
