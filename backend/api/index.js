import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http';
import schoolRoutes from '../routes/schools.js';
import pool from '../db.js'; // ✅ ensure DB loads before handler

dotenv.config();
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// ✅ Test DB on startup (optional but useful)
(async () => {
  try {
    await pool.query('SELECT NOW()'); 
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed', err);
  }
})();

// Routes
app.use('/api', schoolRoutes);

// Health check
app.get('/api', (req, res) => res.json({ status: 'ok' }));

export default serverless(app);
