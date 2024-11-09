const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Enable CORS if frontend and backend are separate
const dbConnection = require('./db'); // Import the database connection
const app = express();

// Load environment variables from .env file
dotenv.config();

// Setup port (default to 5000)
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Enable CORS if frontend is separate
app.use(express.json()); // Parse JSON requests

// Database connection
dbConnection();

// API Routes
app.use('/api/cars', require('./routes/carsRoute')); // Route for car operations
app.use('/api/users', require('./routes/userRoute')); // Route for user operations
app.use('/api/bookings', require('./routes/bookingsRoute')); // Route for bookings

// Root route for server health check
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server started on port ${port}`);
});
