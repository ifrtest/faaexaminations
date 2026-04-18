// server/src/scripts/migrate.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  const file = path.join(__dirname, '..', '..', '..', 'database', 'schema.sql');
  if (!fs.existsSync(file)) {
    console.error('Schema file not found:', file);
    process.exit(1);
  }
  const sql = fs.readFileSync(file, 'utf8');
  console.log('Running schema.sql...');
  await db.query(sql);
  console.log('Done. Tables created.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
