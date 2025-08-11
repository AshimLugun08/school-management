import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import schoolRoutes from './routes/schools.js';
import serverless from 'serverless-http'; // ✨ Wrap express for serverless

dotenv.config();
const app = express();

app.use(cors({
  origin: '*', // Change later for security
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
app.use('/api', schoolRoutes);

// Health check
app.get('/api', (req, res) => res.json({ status: 'ok' }));

export default serverless(app); // ✨ No app.listen()
