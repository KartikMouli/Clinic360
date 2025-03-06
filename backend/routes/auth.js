const express = require('express');
const { registerPatient, registerDoctor, login, loadUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, loadUser);
router.post('/register-patient', registerPatient);
router.post('/register-doctor', registerDoctor);
router.post('/login', login);

module.exports = router;
