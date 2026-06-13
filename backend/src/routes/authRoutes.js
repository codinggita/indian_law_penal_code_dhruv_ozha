const express = require('express');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendOTP,
  verifyOTP,
  sessions,
  toggleBookmark,
  getBookmarks
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected Routes (Require Token Verification)
router.post('/logout', protect, logout);
router.route('/profile')
  .get(protect, getProfile)
  .patch(protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.get('/sessions', protect, sessions);
router.route('/bookmarks')
  .get(protect, getBookmarks);
router.post('/bookmarks/:lawId', protect, toggleBookmark);

module.exports = router;
