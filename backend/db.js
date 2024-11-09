const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

function connectDB() {
    const mongoURI = process.env.MONGO_URL;
    if (!mongoURI) {
        console.error('MongoDB URI is missing. Please set MONGO_URL in the .env file.');
        process.exit(1); // Exit the process if MongoDB URL is not found
    }

    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    const connection = mongoose.connection;
    connection.on('connected', () => {
        console.log('MongoDB connection successful');
    });

    connection.on('error', (error) => {
        console.error(`MongoDB connection error: ${error}`);
        process.exit(1); // Exit the process if the connection fails
    });
}

module.exports = connectDB;
