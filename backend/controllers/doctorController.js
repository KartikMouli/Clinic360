const Doctor = require('../models/Doctor');

exports.searchDoctors = async (req, res) => {
    try {
        const { specialty, location, name } = req.query;
        if (!specialty && !location && !name) {
            return res.status(400).json({ message: 'specialty or location or name required' });
        }

        const cacheKey = `doctors:${specialty || ''}:${location || ''}:${name || ''}`;
        const cachedData = await client.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        let query = {};
        if (specialty) query.specialization = specialty;
        if (location) query.location = location;
        if (name) {
            const nameRegex = new RegExp(name, 'i');
            query.$or = [{ firstName: nameRegex }, { lastName: nameRegex }];
        }

        const doctors = await Doctor.find(query).select('firstName lastName specialization experience location availabilitySlots');

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found' });
        }

        // Cache the result with an expiry (e.g., 3600 seconds = 1 hour)
        await client.set(cacheKey, JSON.stringify(doctors), 'EX', 60);


        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoctorProfile = async (req, res) => {
    try {
        const cacheKey = `doctor:${req.params.id}`;
        const cachedData = await client.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const doctor =await Doctor.findById(req.params.id).select('firstName lastName specialization experience location availabilitySlots');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Cache the doctor profile with an expiry (e.g., 1 hour)
        await client.set(cacheKey, JSON.stringify(doctor), 'EX', 3600);

        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getDoctorAvailability = async (req, res) => {

    const { id, date } = req.params;

    if (!id || !date) {
        return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    try {

        const formattedDate = new Date(date).toISOString().split('T')[0]

        const doctor = await Doctor.findOne(
            { _id: id, 'availabilitySlots.date': formattedDate },
            { 'availabilitySlots.$': 1 }
        );

        if (!doctor) {
            return res.status(404).json({ message: 'No availability found for the specified date' });
        }

        const availability = doctor.availabilitySlots.find(slot =>
            new Date(slot.date).toISOString().split('T')[0] === formattedDate
        );


        if (!availability) {
            return res.json([]);
        }

        res.json(availability.slots.filter(slot => slot.isAvailable));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getLocation = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }

        const doctor = await Doctor.findById(req.params.id).select('location');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(doctor.location);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { id, location } = req.body;

        if (!id || !location) {
            return res.status(400).json({ message: 'Doctor ID and new location are required' });
        }

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: { location } },
            { new: true }
        ).select('location');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(doctor.location);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





