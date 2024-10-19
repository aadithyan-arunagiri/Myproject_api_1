const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Import auth routes (JWT will be used here)
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);

// MongoDB connection using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start server on PORT from .env or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
