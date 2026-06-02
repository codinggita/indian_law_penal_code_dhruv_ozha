const express = require('express');
const {
  getUsers,
  getUserById,
  banUser,
  unbanUser,
  changeUserRole,
  getReports,
  resolveReport,
  getSystemHealth,
  getSystemLogs,
  toggleMaintenanceMode,
  clearCache,
  getSecurityEvents
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply protect and authorize('admin') to all routes in this router
router.use(protect);
router.use(authorize('admin'));

// User Management Routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/role', changeUserRole);

// Reports Management Routes
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

// System Management Routes
router.get('/system/health', getSystemHealth);
router.get('/system/logs', getSystemLogs);
router.post('/system/maintenance', toggleMaintenanceMode);
router.delete('/cache/clear', clearCache);
router.get('/security/events', getSecurityEvents);

module.exports = router;
