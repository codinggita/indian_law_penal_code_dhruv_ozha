const Law = require('../models/Law');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// 1. Fetch total count of all laws
exports.getTotalCount = asyncHandler(async (req, res, next) => {
  const total = await Law.countDocuments({});
  return ApiResponse.success(res, 'Total law count fetched successfully', { total }, 200);
});

// 2. Fetch total active law count
exports.getActiveCount = asyncHandler(async (req, res, next) => {
  const total = await Law.countDocuments({ status: 'active' });
  return ApiResponse.success(res, 'Active law count fetched successfully', { total }, 200);
});

// 3. Fetch total repealed law count
exports.getRepealedCount = asyncHandler(async (req, res, next) => {
  const total = await Law.countDocuments({ status: 'repealed' });
  return ApiResponse.success(res, 'Repealed law count fetched successfully', { total }, 200);
});

async function groupCount(field, message) {
  const data = await Law.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return { message, data };
}

// 4. Fetch group distributions by act
exports.getByAct = asyncHandler(async (req, res, next) => {
  const result = await groupCount('actName', 'Law count by act fetched successfully');
  return ApiResponse.success(res, result.message, result.data, 200);
});

// 5. Fetch group distributions by category
exports.getByCategory = asyncHandler(async (req, res, next) => {
  const result = await groupCount('category', 'Law count by category fetched successfully');
  return ApiResponse.success(res, result.message, result.data, 200);
});

// 6. Fetch group distributions by state
exports.getByState = asyncHandler(async (req, res, next) => {
  const result = await groupCount('state', 'Law count by state fetched successfully');
  return ApiResponse.success(res, result.message, result.data, 200);
});

// 7. Fetch group distributions by court
exports.getByCourt = asyncHandler(async (req, res, next) => {
  const data = await Law.aggregate([
    { $match: { court: { $exists: true, $ne: '' } } },
    { $group: { _id: '$court', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return ApiResponse.success(res, 'Law count by court fetched successfully', data, 200);
});

// 8. Fetch last 30-day stats
exports.getRecentStats = asyncHandler(async (req, res, next) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const total = await Law.countDocuments({ createdAt: { $gte: since } });
  return ApiResponse.success(res, 'Recent law stats fetched successfully', { last30Days: total }, 200);
});

// 9. Fetch trending statistics overview
exports.getTrendingStats = asyncHandler(async (req, res, next) => {
  const data = await Law.find({}).sort('-views').limit(10).select('sectionNumber title views');
  return ApiResponse.success(res, 'Trending law stats fetched successfully', data, 200);
});

// 10. Fetch total user bookmark count
exports.getBookmarkStats = asyncHandler(async (req, res, next) => {
  const total = await Law.aggregate([{ $group: { _id: null, total: { $sum: '$bookmarkCount' } } }]);
  return ApiResponse.success(res, 'Bookmark stats fetched successfully', { totalBookmarks: total[0]?.total || 0 }, 200);
});
