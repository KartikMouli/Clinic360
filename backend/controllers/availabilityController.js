const Doctor = require('../models/Doctor');



exports.addTimeSlot = async (req, res) => {

    try {
        const { date, startTime } = req.body;
        const doctorId = req.user.id;

        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Check if the slot already exists
        const doctor = await Doctor.findOne({
            _id: doctorId,
            'availabilitySlots.date': formattedDate,
            'availabilitySlots.slots.time': startTime,
        });

        if (doctor) {
            return res.status(400).json({ message: 'Time slot already exists for this day' });
        }

        // Add the slot if it doesn't exist
        const updatedDoctor = await Doctor.findOneAndUpdate(
            { _id: doctorId, 'availabilitySlots.date': formattedDate },
            {
                $addToSet: { 'availabilitySlots.$.slots': { time: startTime, isAvailable: true } },
            },
            { new: true }
        );

        if (!updatedDoctor) {
            // If the date doesn't exist, create a new availability slot
            await Doctor.findByIdAndUpdate(doctorId, {
                $push: {
                    availabilitySlots: {
                        date: formattedDate,
                        slots: [{ time: startTime, isAvailable: true }],
                    },
                },
            });
        }

        res.status(201).json({ message: 'Time slot added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.deleteTimeSlot = async (req, res) => {
    try {
        const { date, time } = req.params;
        const doctorId = req.user.id;

        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Use $pull to remove the specific slot atomically
        const doctor = await Doctor.findOneAndUpdate(
            { _id: doctorId, 'availabilitySlots.date': formattedDate },
            {
                $pull: { 'availabilitySlots.$.slots': { time } },
            },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor or time slot not found' });
        }

        // Remove the entire date if no slots are left
        await Doctor.findByIdAndUpdate(doctorId, {
            $pull: { availabilitySlots: { date: formattedDate, slots: { $size: 0 } } },
        });

        res.status(200).json({ message: 'Time slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
