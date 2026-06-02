import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import courseRoutes from './routes/courseRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import configRoutes from './routes/configRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// Body Parsers
// ----------------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ----------------------------
// Payload Size Logging
// ----------------------------
app.use((req, res, next) => {
  const size = req.get('content-length');

  if (size) {
    console.log(
      `[PAYLOAD] ${req.method} ${req.url} - Size: ${(
        parseInt(size) /
        (1024 * 1024)
      ).toFixed(2)} MB`
    );
  }

  next();
});

// ----------------------------
// CORS
// ----------------------------
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// ----------------------------
// Request Logger
// ----------------------------
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  );
  next();
});

// ====================================================
// UPTIMEROBOT HEALTH CHECKS
// ====================================================

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'PromptPal API',
    timestamp: new Date().toISOString(),
  });
});

app.head('/', (req, res) => {
  res.sendStatus(200);
});

// Dedicated health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database:
      mongoose.connection.readyState === 1
        ? 'Connected'
        : 'Disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.head('/health', (req, res) => {
  res.sendStatus(200);
});

// Alternative one-line catch-all health route
app.all('/ping', (req, res) => {
  res.sendStatus(200);
});

// ====================================================
// API ROUTES
// ====================================================

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/config', configRoutes);

// Existing status endpoint
app.get('/api/status', (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1
      ? 'Connected'
      : 'Disconnected';

  res.json({
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ====================================================
// START SERVER
// ====================================================

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);

  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.warn(
        'Server remains online, but database-dependent requests will fail.'
      );
    });
});