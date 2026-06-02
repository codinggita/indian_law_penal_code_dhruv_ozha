require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import routers
const lawRoutes = require('./src/routes/lawRoutes');
const authRoutes = require('./src/routes/authRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const jwtRoutes = require('./src/routes/jwtRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const middlewareRoutes = require('./src/routes/middlewareRoutes');

// Import middlewares
const requestLogger = require('./src/middlewares/requestLogger');
const rateLimiter = require('./src/middlewares/rateLimiter');
const { notFound, errorHandler } = require('./src/middlewares/errorHandler');

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Global API Rate Limiter
app.use('/api/', rateLimiter);

// Health check endpoints
app.get('/api/v1/health', (req, res) => {
  res.setHeader('X-API-Health', 'Healthy');
  return res.status(200).json({ success: true, message: 'Indian Law Penal Code API is healthy.' });
});

app.get('/api/health', (req, res) => {
  return res.status(200).json({ success: true, message: 'Server is running.' });
});

// Basic Route
app.get('/', (req, res) => {
  return res.send('Indian Law Penal Code API is running...');
});

// Mount Routes
app.use('/api/v1/laws', lawRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/jwt', jwtRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/middleware', middlewareRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
