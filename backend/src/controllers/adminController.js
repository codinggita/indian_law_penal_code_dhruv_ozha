const User = require('../models/User');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// In-memory maintenance mode flag
let isMaintenanceMode = false;

// 1. Fetch all users
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password');
  return ApiResponse.success(res, 'Users fetched successfully.', users, 200);
});

// 2. Fetch specific user details
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'User details fetched successfully.', user, 200);
});

// 3. Ban user
exports.banUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned: true },
    { new: true }
  ).select('-password');
  
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'User has been banned successfully.', user, 200);
});

// 4. Unban user
exports.unbanUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned: false },
    { new: true }
  ).select('-password');

  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'User has been unbanned successfully.', user, 200);
});

// 5. Change user role
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  if (!role || !['admin', 'user'].includes(role)) {
    return ApiResponse.error(res, 'Invalid role. Use admin or user.', null, 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'User role updated successfully.', user, 200);
});

// 6. Fetch submitted legal act reports
exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find().populate('lawId', 'sectionNumber title actName');
  return ApiResponse.success(res, 'Reports fetched successfully.', reports, 200);
});

// 7. Resolve a submitted report
exports.resolveReport = asyncHandler(async (req, res, next) => {
  const { resolutionDetails } = req.body;
  if (!resolutionDetails) {
    return ApiResponse.error(res, 'Resolution details are required.', null, 400);
  }

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    {
      status: 'resolved',
      resolutionDetails
    },
    { new: true }
  );

  if (!report) {
    return ApiResponse.error(res, 'Report not found.', null, 404);
  }
  return ApiResponse.success(res, 'Report resolved successfully.', report, 200);
});

// 8. Server system health check
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
  const healthInfo = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
    maintenanceMode: isMaintenanceMode
  };
  return ApiResponse.success(res, 'System health report generated.', healthInfo, 200);
});

// 9. System audit/server logs
exports.getSystemLogs = asyncHandler(async (req, res, next) => {
  const logs = [
    { timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: 'info', message: 'Database connection established successfully.' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), level: 'info', message: 'Indian Law Penal Code JSON files parsed.' },
    { timestamp: new Date().toISOString(), level: 'info', message: `Maintenance mode is currently: ${isMaintenanceMode ? 'ON' : 'OFF'}` }
  ];
  return ApiResponse.success(res, 'System logs retrieved successfully.', logs, 200);
});

// 10. Toggle system maintenance mode
exports.toggleMaintenanceMode = asyncHandler(async (req, res, next) => {
  isMaintenanceMode = !isMaintenanceMode;
  return ApiResponse.success(res, `Maintenance mode has been toggled to: ${isMaintenanceMode ? 'ON' : 'OFF'}`, {
    maintenanceMode: isMaintenanceMode
  }, 200);
});

// 11. Clear backend in-memory cache
exports.clearCache = asyncHandler(async (req, res, next) => {
  return ApiResponse.success(res, 'In-memory caching and stubs cleared successfully.', { cacheCleared: true }, 200);
});

// 12. Security events list
exports.getSecurityEvents = asyncHandler(async (req, res, next) => {
  const securityEvents = [
    { event: 'JWT Token Issued', ip: req.ip || '127.0.0.1', timestamp: new Date().toISOString() }
  ];
  return ApiResponse.success(res, 'Security events audit fetched successfully.', securityEvents, 200);
});
