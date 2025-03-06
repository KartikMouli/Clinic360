const express = require('express');
const { searchDoctors, getDoctorProfile, setAvailability, getDoctorAvailability, getLocation, updateLocation } = require('../controllers/doctorController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/search', searchDoctors);
router.get('/:id', auth, getDoctorProfile);

router.get('/:id/availability/:date', getDoctorAvailability);

router.get('/location/:id', auth, getLocation);
router.put('/location', auth, updateLocation);


module.exports = router;
