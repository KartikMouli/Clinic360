const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/patient/:id', auth, appointmentController.getPatientAppointments);
router.get('/doctor/:id', auth, appointmentController.getDoctorAppointments)

router.post('/book', auth, appointmentController.bookAppointment);
router.put('/cancel', auth, appointmentController.cancelAppointment);

module.exports = router;
