// backend/src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import experimentRoutes from './routes/experiment.routes';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes'; // <-- 1. IMPORT event routes

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', experimentRoutes);
app.use('/api/v1', eventRoutes); // <-- 2. USE event routes

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    prisma.$disconnect();
  });
});
