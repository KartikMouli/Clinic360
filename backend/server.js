const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const availabilityRoutes = require('./routes/availability');

const connectDB = require('./config/db');
const { ConnectRedis } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow specific origins (frontend URL)
const allowedOrigins = [
    'https://clinic360.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// CORS Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Connect to database
connectDB();

// Connect to Redis Cloud
ConnectRedis();


// Root route to indicate API info
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the backend API for Clinic360!',
        status: 'Running',
        website: 'https://clinic360.vercel.app',
        repository:'https://github.com/KartikMouli/Clinic360',
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
