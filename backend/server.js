const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const questionRoutes = require('./routes/questions');
const progressRoutes = require('./routes/progress');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

// AI evaluation endpoint
app.use('/api/ai/evaluate', require('./routes/ai'));

// Default route
app.get('/', (req, res) => {
  res.send('UnlockED API is running');
});

// Connect to MongoDB (commented out for development without MongoDB)
const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unlocked');
    console.log('MongoDB connection skipped for development');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to database
connectDB();

module.exports = app;