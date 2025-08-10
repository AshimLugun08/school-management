import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import schoolRoutes from './routes/schools.js';

dotenv.config();
const app = express();

// ✅ Allow frontend access
app.use(cors({
  origin: 'http://localhost:5173', // your React app URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
app.use('/api', schoolRoutes);

// Health check
app.get('/api', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
