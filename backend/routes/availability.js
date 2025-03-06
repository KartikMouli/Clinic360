const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addTimeSlot, deleteTimeSlot } = require('../controllers/availabilityController');


router.post('/add', auth, addTimeSlot);

router.delete('/:date/:time', auth, deleteTimeSlot);

module.exports = router;
