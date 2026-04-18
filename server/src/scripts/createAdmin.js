// server/src/scripts/createAdmin.js
// Usage: node src/scripts/createAdmin.js admin@example.com Password123 "Jane Admin"
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db     = require('../config/db');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

async function main() {
  const [email, password, ...nameParts] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage: node src/scripts/createAdmin.js <email> <password> [full name]');
    process.exit(1);
  }
  const fullName = nameParts.join(' ') || 'Administrator';
  const hash = await bcrypt.hash(password, ROUNDS);

  const existing = await db.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
  if (existing.rows[0]) {
    await db.query(
      `UPDATE users SET password_hash=$1, role='admin', full_name=$2, is_active=TRUE, updated_at=NOW()
       WHERE id=$3`,
      [hash, fullName, existing.rows[0].id]
    );
    console.log(`Updated existing user -> admin: ${email}`);
  } else {
    await db.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1,$2,$3,'admin')`,
      [email.toLowerCase(), hash, fullName]
    );
    console.log(`Created admin user: ${email}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
