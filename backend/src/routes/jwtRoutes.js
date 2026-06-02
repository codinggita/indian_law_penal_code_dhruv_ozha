const express = require('express');
const {
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
  jwtProfile,
  jwtDashboard,
  privateLaws,
  privateAnalytics
} = require('../controllers/jwtController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/generate-token', generateToken);
router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshToken);
router.delete('/revoke-token', protect, revokeToken);

router.get('/profile', protect, jwtProfile);
router.get('/dashboard', protect, jwtDashboard);
router.get('/private-laws', protect, privateLaws);
router.get('/private-analytics', protect, privateAnalytics);

module.exports = router;
