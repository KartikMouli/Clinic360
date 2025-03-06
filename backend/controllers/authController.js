const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');


exports.registerPatient = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }


        const user = await Patient.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const patient = new Patient({ firstName, lastName, email, password: hashedPassword });
        await patient.save();


        res.status(200).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.registerDoctor = async (req, res) => {
    try {
        const { firstName, lastName, email, password, specialty, experience, location } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !specialty || !experience || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate experience (must be a positive integer)
        if (isNaN(experience) || parseInt(experience, 10) <= 0) {
            return res.status(400).json({ message: 'Experience must be a positive number' });
        }

        const user = await Doctor.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'user already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = new Doctor({ firstName, lastName, email, password: hashedPassword, specialization: specialty, experience, location });
        await doctor.save();
        res.status(200).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const Model = role == 'doctor' ? Doctor : Patient;
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found. Please register !' });
        }

        if (! await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);

        res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role } });
    } catch (error) {

        res.status(400).json({ error: error.message });
    }
};


exports.loadUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Token missing or malformed' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const Model = decoded.role === 'doctor' ? Doctor : Patient;
        const user = await Model.findById(decoded.id).select('-password');


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: decoded.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

