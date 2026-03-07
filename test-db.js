const { Pool } = require('pg');

async function testConnection(dbName) {
  const pool = new Pool({
    connectionString: `postgresql://postgres:Kal%40%233210@localhost:5432/${dbName}`,
    ssl: false // { rejectUnauthorized: false }
  });
  
  try {
    await pool.query('SELECT 1');
    console.log(`Successfully connected to ${dbName}`);
    return true;
  } catch (err) {
    console.error(`Failed to connect to ${dbName}:`, err.message);
    return false;
  } finally {
    await pool.end();
  }
}

async function main() {
  await testConnection('agriconnect');
  await testConnection('agriconnect2');
}

main();
