const express = require('express');
const cors = require('cors');

require('dotenv').config();


const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const availabilityRoutes = require('./routes/availability');


const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow specific origins (frontend URL)
const allowedOrigins = ['https://arogo-ai-clinic360-dj39-kartik-moulis-projects.vercel.app/', 'https://arogo-ai-clinic360-dj39.vercel.app/','https://arogo-ai-clinic360-dj39-git-main-kartik-moulis-projects.vercel.app/','https://arogo-ai-clinic360-dj39-9mx1gg69v-kartik-moulis-projects.vercel.app/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability',availabilityRoutes)



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
