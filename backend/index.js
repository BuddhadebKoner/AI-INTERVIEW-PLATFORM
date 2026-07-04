import dotenv from 'dotenv';

// Load environment variables first before any other imports
dotenv.config();

import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import interviewRoutes from './routes/interview.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
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
    mongodb:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    clerk: process.env.CLERK_SECRET_KEY ? 'configured' : 'not configured',
  });
});

app.use('/api/user', userRoutes);
app.use('/api/interview', interviewRoutes);

// Socket.IO connection handling
io.on('connection', socket => {
  console.log('🔌 Client connected:', socket.id);

  // Join interview room
  socket.on('join-interview', interviewId => {
    socket.join(interviewId);
    console.log(`👤 Socket ${socket.id} joined interview room: ${interviewId}`);
  });

  // Handle interview question flow
  socket.on('question-asked', data => {
    console.log(
      `📝 Question ${data.questionNumber} asked in interview ${data.interviewId}`,
    );
    io.to(data.interviewId).emit('question-status', {
      questionNumber: data.questionNumber,
      status: 'asked',
    });
  });

  // Handle answer submission
  socket.on('answer-submitted', data => {
    console.log(
      `✅ Answer submitted for question ${data.questionNumber} in interview ${data.interviewId}`,
    );
    io.to(data.interviewId).emit('answer-status', {
      questionNumber: data.questionNumber,
      status: 'submitted',
      answer: data.answer,
    });
  });

  // Handle answer analysis
  socket.on('answer-analyzed', data => {
    console.log(
      `🎯 Answer analyzed for question ${data.questionNumber} in interview ${data.interviewId}`,
    );
    io.to(data.interviewId).emit('analysis-result', {
      questionNumber: data.questionNumber,
      analysis: data.analysis,
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
