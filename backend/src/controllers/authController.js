const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/v1/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Name, email, and password are required.', null, 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return ApiResponse.error(res, 'User already exists.', null, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword
  });

  const token = createToken(user);

  return ApiResponse.success(res, 'User registered successfully.', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    },
    token
  }, 201);
});

// POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 'Email and password are required.', null, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials.', null, 401);
  }

  if (user.isBanned) {
    return ApiResponse.error(res, 'This account has been banned.', null, 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid credentials.', null, 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const token = createToken(user);

  return ApiResponse.success(res, 'Login successful.', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    },
    token
  }, 200);
});

// POST /api/v1/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Stateful revocation: save to blacklist database collection
    await TokenBlacklist.create({ token });
  }
  return ApiResponse.success(res, 'Logged out successfully (token revoked).', {}, 200);
});

// GET /api/v1/auth/profile
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'Profile fetched successfully.', user, 200);
});

// PATCH /api/v1/auth/profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  const updates = {};
  if (name) updates.name = name.trim();
  if (email) updates.email = email.toLowerCase().trim();

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'Profile updated successfully.', user, 200);
});

// POST /api/v1/auth/change-password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return ApiResponse.error(res, 'Old and new passwords are required.', null, 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Incorrect current password.', null, 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return ApiResponse.success(res, 'Password changed successfully.', {}, 200);
});

// POST /api/v1/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return ApiResponse.error(res, 'Email is required.', null, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }

  // Generate 6-digit verification code acting as a reset password token/OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await user.save();

  console.log(`[SMTP SIMULATION] Reset Password Token/OTP for ${user.email} is: ${otp}`);
  return ApiResponse.success(res, 'Reset password OTP sent successfully (Simulated).', { email }, 200);
});

// POST /api/v1/auth/reset-password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return ApiResponse.error(res, 'Email, OTP, and new password are required.', null, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return ApiResponse.error(res, 'Invalid or expired OTP/Reset Token.', null, 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return ApiResponse.success(res, 'Password reset successfully.', {}, 200);
});

// POST /api/v1/auth/verify-email
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return ApiResponse.error(res, 'Email is required.', null, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }

  return ApiResponse.success(res, 'Email verification checked.', {
    email: user.email,
    isVerified: user.isVerified
  }, 200);
});

// POST /api/v1/auth/send-otp
exports.sendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return ApiResponse.error(res, 'Email is required.', null, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await user.save();

  console.log(`[SMTP SIMULATION] Email verification OTP for ${user.email} is: ${otp}`);
  return ApiResponse.success(res, 'OTP sent successfully (Simulated).', { email }, 200);
});

// POST /api/v1/auth/verify-otp
exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return ApiResponse.error(res, 'Email and OTP are required.', null, 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return ApiResponse.error(res, 'Invalid or expired OTP.', null, 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return ApiResponse.success(res, 'Email verified successfully.', { isVerified: true }, 200);
});

// GET /api/v1/auth/sessions
exports.sessions = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }

  const activeSessions = [
    {
      device: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
      lastActive: user.lastLogin || user.updatedAt,
      isCurrentSession: true
    }
  ];

  return ApiResponse.success(res, 'Active sessions fetched successfully.', activeSessions, 200);
});

// GET /api/v1/auth/bookmarks
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('bookmarks');
  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }
  return ApiResponse.success(res, 'Bookmarks fetched successfully.', user.bookmarks, 200);
});

// POST /api/v1/auth/bookmarks/:lawId
exports.toggleBookmark = asyncHandler(async (req, res, next) => {
  const { lawId } = req.params;
  const user = await User.findById(req.user.id);
  const Law = require('../models/Law');

  if (!user) {
    return ApiResponse.error(res, 'User not found.', null, 404);
  }

  const law = await Law.findById(lawId);
  if (!law) {
    return ApiResponse.error(res, 'Law not found.', null, 404);
  }

  const isBookmarked = user.bookmarks.includes(lawId);
  if (isBookmarked) {
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== lawId);
    law.bookmarkCount = Math.max(0, law.bookmarkCount - 1);
  } else {
    user.bookmarks.push(lawId);
    law.bookmarkCount += 1;
  }

  await user.save();
  await law.save();

  return ApiResponse.success(res, isBookmarked ? 'Bookmark removed.' : 'Bookmark added.', {
    isBookmarked: !isBookmarked,
    bookmarks: user.bookmarks
  }, 200);
});
