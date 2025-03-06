const mongoose = require('mongoose');


const availabilitySlotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    slots: [{
        time: String,
        isAvailable: { type: Boolean, default: true }
    }]
});

const doctorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    availabilitySlots: [availabilitySlotSchema]
}, { timestamps: true });



module.exports = mongoose.model('Doctor', doctorSchema);
