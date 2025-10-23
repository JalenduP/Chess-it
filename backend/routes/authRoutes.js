const express = require('express');
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
  checkEmailAvailability,
  checkUsernameAvailability,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);
router.get('/check-email/:email', checkEmailAvailability);
router.get('/check-username/:username', checkUsernameAvailability);

// Protected routes
router.post('/logout', protect, logout);

module.exports = router;