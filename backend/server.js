const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Route files
const lawRoutes = require('./routes/lawRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/error');

const app = express();

// Standard middleware
app.use(express.json());
app.use(cors());

// Enable pre-flight requests for all routes
app.options('*', cors());

// Mount routers
app.use('/api/v1/laws', lawRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

// Basic health-check route to verify server status
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Indian Penal Code API Server is running successfully!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
