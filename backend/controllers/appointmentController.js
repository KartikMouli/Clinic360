const { default: mongoose } = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendEmail } = require('../utils/emailService');
const { format } = require('date-fns')

exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.id })
            .populate('doctorId', 'firstName lastName specialization')
            .sort({ appointmentDate: 1, startTime: 1 });


        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.id })
            .populate('patientId', 'firstName lastName')
            .sort({ appointmentDate: 1, startTime: 1 });
 

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.bookAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { doctorId, appointmentDate, startTime, patientId } = req.body;


        const doctor = await Doctor.findOne(
            {
                _id: doctorId,
                'availabilitySlots': {
                    $elemMatch: {
                        date: appointmentDate,
                        slots: {
                            $elemMatch: {
                                time: startTime,
                                isAvailable: true
                            }
                        }
                    }
                }
            },
            null,
            { session }
        );


        if (!doctor) {
            throw new Error('Doctor or slot not available');
        }


        // Update the slot to be unavailable
        await Doctor.updateOne(
            {
                _id: doctorId,
                'availabilitySlots.date': appointmentDate,
                'availabilitySlots.slots.time': startTime
            },
            { $set: { 'availabilitySlots.$[outer].slots.$[inner].isAvailable': false } },
            {
                arrayFilters: [
                    { 'outer.date': appointmentDate },
                    { 'inner.time': startTime }
                ],
                session
            }
        );

        // Create the appointment
        const appointment = new Appointment({
            patientId: patientId,
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            startTime: startTime,
            status: 'Scheduled'
        });
        await appointment.save({ session });


        await session.commitTransaction();


        // Send email notification (outside transaction)
        const emailContent = `
            Dear ${req.user.firstName},\n
            Your appointment has been successfully booked\n. Here are the details:\n
            - Doctor: Dr. ${doctor.firstName} ${doctor.lastName}\n
            - Specialization: ${doctor.specialization}\n
            - Location: ${doctor.location}\n
            - Date: ${format(appointmentDate, 'MMMM d, yyyy')}\n
            - Time: ${startTime}\n
            \n
            Please arrive 10 minutes early and bring any relevant documents.\n
            Thank you for choosing our service.\n
            Regards,\n
            Clinic360 Team
            `;
        try {
            await sendEmail(
                req.user.email,
                'Appointment Confirmation',
                emailContent
            );
            
        } catch (emailError) {
            console.error("Error sending email:", emailError);

        }


        res.status(201).json({ message: 'Appointment booked successfully', appointment });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

exports.cancelAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { appointmentId } = req.body;

        // Find the appointment
        const appointment = await Appointment.findOne({ _id: appointmentId }).session(session);

        if (!appointment) {
            throw new Error('Appointment not found or not authorized to cancel');
        }

        const doctor = await Doctor.findOne(
            {
                _id: appointment.doctorId,
            },
            null,
            { session }
        );

        // Find and update the corresponding slot to mark it as available
        await Doctor.updateOne(
            {
                _id: appointment.doctorId,
                'availabilitySlots.date': appointment.appointmentDate,
                'availabilitySlots.slots.time': appointment.startTime
            },
            {
                $set: { 'availabilitySlots.$[outer].slots.$[inner].isAvailable': true }
            },
            {
                arrayFilters: [
                    { 'outer.date': appointment.appointmentDate },
                    { 'inner.time': appointment.startTime }
                ],
                session
            }
        );

        // Update the appointment status to 'Canceled'
        appointment.status = 'Canceled';
        await appointment.save({ session });

        await session.commitTransaction();

        // Send email notification (outside transaction)
        const cancellationEmailContent = `
            Dear ${req.user.firstName},\n
            We regret to inform you that your appointment has been canceled. Here are the details of the canceled appointment:\n
            - Doctor: Dr. ${doctor.firstName} ${doctor.lastName}\n
            - Location: ${doctor.location}\n
            - Date: ${format(appointment.appointmentDate, 'MMMM d, yyyy')}\n
            - Time: ${appointment.startTime}\n
            \n
            If this cancellation was unexpected or if you would like to reschedule, please contact us at your earliest convenience.\n
            We apologize for any inconvenience caused.\n
            \n
            Thank you for your understanding.\n
            Regards,\n
            Clinic360 Team
`;

        try {
            await sendEmail(
                req.user.email,
                'Appointment Cancellation',
                cancellationEmailContent
            );
            
        } catch (emailError) {
            console.error("Error sending email:", emailError);

        }

        res.status(200).json({ message: 'Appointment cancelled successfully' });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
