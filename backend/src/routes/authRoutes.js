const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, sendLoginOtp, verifyLoginOtp } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const authValidation = require('../validations/authValidation');

router.post('/register', validateRequest(authValidation.register), registerUser);
router.post('/login', validateRequest(authValidation.login), loginUser);
router.post('/send-otp', validateRequest(authValidation.sendOtp), sendLoginOtp);
router.post('/verify-otp', validateRequest(authValidation.verifyOtp), verifyLoginOtp);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
