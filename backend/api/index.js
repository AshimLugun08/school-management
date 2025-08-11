import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import schoolRoutes from '../routes/schools.js';
import serverless from 'serverless-http';

dotenv.config();
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

app.use('/api', schoolRoutes);
app.get('/api', (req, res) => res.json({ status: 'ok' }));

export default serverless(app);
