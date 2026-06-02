const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// POST /api/v1/jwt/generate-token
exports.generateToken = asyncHandler(async (req, res, next) => {
  const payload = req.body?.payload || { role: 'user' };
  const token = sign(payload);
  return ApiResponse.success(res, 'Token generated successfully', { token }, 200);
});

// POST /api/v1/jwt/verify-token
exports.verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.body?.token;
  if (!token) {
    return ApiResponse.error(res, 'Token is required.', null, 400);
  }

  // Stateful blacklist revocation check
  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    return ApiResponse.error(res, 'Invalid token. Token has been revoked.', null, 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return ApiResponse.success(res, 'Token verified successfully', decoded, 200);
});

// POST /api/v1/jwt/refresh-token
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Not authorized. Missing bearer token.', null, 401);
  }
  const token = auth.split(' ')[1];

  // Stateful blacklist revocation check
  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    return ApiResponse.error(res, 'Invalid token. Token has been revoked.', null, 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const refreshed = sign({ id: decoded.id, role: decoded.role });
  return ApiResponse.success(res, 'Token refreshed successfully', { token: refreshed }, 200);
});

// DELETE /api/v1/jwt/revoke-token
exports.revokeToken = asyncHandler(async (req, res, next) => {
  let token = req.body?.token;

  if (!token) {
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
  }

  if (!token) {
    return ApiResponse.error(res, 'Token is required for revocation.', null, 400);
  }

  // Save to stateful blacklist collection
  await TokenBlacklist.create({ token });
  return ApiResponse.success(res, 'Token revoked successfully statefully.', {}, 200);
});

// GET /api/v1/jwt/profile
exports.jwtProfile = asyncHandler(async (req, res, next) => {
  return ApiResponse.success(res, 'JWT profile fetched successfully', req.user, 200);
});

// GET /api/v1/jwt/dashboard
exports.jwtDashboard = asyncHandler(async (req, res, next) => {
  return ApiResponse.success(res, 'JWT dashboard fetched successfully', { role: req.user.role }, 200);
});

// GET /api/v1/jwt/private-laws
exports.privateLaws = asyncHandler(async (req, res, next) => {
  return ApiResponse.success(res, 'Private laws route access granted', {}, 200);
});

// GET /api/v1/jwt/private-analytics
exports.privateAnalytics = asyncHandler(async (req, res, next) => {
  return ApiResponse.success(res, 'Private analytics route access granted', {}, 200);
});
