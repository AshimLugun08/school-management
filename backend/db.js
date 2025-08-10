import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST, // optional if in URL
  ssl: { rejectUnauthorized: false },
  family: 4 // 👈 Force IPv4
});

export default pool;
