// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schools.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', schoolRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
