import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';
import tenantsRouter from './routes/tenants.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; 

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,    
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/tenants', tenantsRouter);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
