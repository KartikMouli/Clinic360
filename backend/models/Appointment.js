const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // Use ISO time string
    status: { type: String,enum: ["Scheduled", "Completed", "Canceled"], default: "Scheduled" }
});

module.exports = mongoose.model("Appoint", appointmentSchema)
