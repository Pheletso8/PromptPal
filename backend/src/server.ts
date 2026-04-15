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

// 1. Body Parsers (FIRST)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Size Logging (For Debugging)
app.use((req, res, next) => {
  const size = req.get('content-length');
  if (size) {
    console.log(`[PAYLOAD] ${req.method} ${req.url} - Size: ${(parseInt(size) / (1024 * 1024)).toFixed(2)} MB`);
  }
  next();
});

// 3. CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// 4. Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/config', configRoutes);

// Health check endpoint
app.get('/api/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);

  // Database Connection (asynchronous)
  mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.warn('Note: The server is running but requests requiring a database will fail until connected.');
    });
});
