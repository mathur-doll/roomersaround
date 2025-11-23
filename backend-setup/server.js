/**
 * RoomersAround Backend Server
 * Main entry point for the Express API
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (MongoDB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roomersaround';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
const usersRouter = require('./routes/users');
const propertiesRouter = require('./routes/properties');
const eventsRouter = require('./routes/events');

app.use('/api/users', usersRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/events', eventsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'RoomersAround API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RoomersAround API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      properties: '/api/properties',
      events: '/api/events',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 RoomersAround API Server`);
  console.log('='.repeat(50));
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📚 Endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/users`);
  console.log(`   - GET  http://localhost:${PORT}/api/properties`);
  console.log(`   - GET  http://localhost:${PORT}/api/events`);
  console.log('='.repeat(50));
});

module.exports = app;
