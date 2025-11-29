import dotenv from 'dotenv';

// Load environment variables first before any other imports
dotenv.config();

import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import interviewRoutes from './routes/interview.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Clerk middleware - must be before routes
app.use(clerkMiddleware());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get('/', (req, res) => {
  return res.json({ message: 'API is running...' });
});

app.get('/api/health', (req, res) => {
  return res.json({
    success: true,
    message: 'Server is healthy',
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    clerk: process.env.CLERK_SECRET_KEY ? 'configured' : 'not configured',
  });
});

app.use('/api/user', userRoutes);
app.use('/api/interview', interviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
