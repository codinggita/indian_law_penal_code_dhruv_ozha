const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Standard middleware
app.use(express.json());
app.use(cors());

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
