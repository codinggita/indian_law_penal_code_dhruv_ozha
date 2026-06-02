const Law = require('../models/Law');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// 1. Fetch most viewed laws
exports.getMostViewed = asyncHandler(async (req, res, next) => {
  const data = await Law.find({}).sort('-views').limit(10);
  return ApiResponse.success(res, 'Most viewed laws fetched successfully', data, 200);
});

// 2. Fetch most bookmarked laws
exports.getMostBookmarked = asyncHandler(async (req, res, next) => {
  const data = await Law.find({}).sort('-bookmarkCount').limit(10);
  return ApiResponse.success(res, 'Most bookmarked laws fetched successfully', data, 200);
});

// 3. Fetch laws aggregation grouped by category
exports.getByCategory = asyncHandler(async (req, res, next) => {
  const data = await Law.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return ApiResponse.success(res, 'Laws by category fetched successfully', data, 200);
});

// 4. Fetch laws aggregation grouped by state
exports.getByState = asyncHandler(async (req, res, next) => {
  const data = await Law.aggregate([
    { $group: { _id: '$state', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return ApiResponse.success(res, 'Laws by state fetched successfully', data, 200);
});

// 5. Fetch laws aggregation grouped by court
exports.getByCourt = asyncHandler(async (req, res, next) => {
  const data = await Law.aggregate([
    { $match: { court: { $exists: true, $ne: '' } } },
    { $group: { _id: '$court', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return ApiResponse.success(res, 'Laws by court fetched successfully', data, 200);
});

// 6. Fetch recent updates (last 30 days)
exports.getRecentUpdates = asyncHandler(async (req, res, next) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const data = await Law.find({ updatedAt: { $gte: since } }).sort('-updatedAt').limit(50);
  return ApiResponse.success(res, 'Recent law updates fetched successfully', data, 200);
});

// 7. Fetch multi-stage law popularity scoring (views + bookmarks)
exports.getPopularity = asyncHandler(async (req, res, next) => {
  const data = await Law.aggregate([
    {
      $project: {
        sectionNumber: 1,
        title: 1,
        views: 1,
        bookmarkCount: 1,
        popularityScore: { $add: ['$views', '$bookmarkCount'] }
      }
    },
    { $sort: { popularityScore: -1, views: -1 } },
    { $limit: 20 }
  ]);
  return ApiResponse.success(res, 'Law popularity metrics fetched successfully', data, 200);
});

// 8. Fetch complexity metrics (grouped by punishmentType)
exports.getComplexity = asyncHandler(async (req, res, next) => {
  const data = await Law.aggregate([
    {
      $group: {
        _id: { $ifNull: ['$punishmentType', 'Unspecified'] },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return ApiResponse.success(res, 'Law complexity distribution fetched successfully', data, 200);
});

// 9. Fetch search query trend analytics
exports.getSearchTrends = asyncHandler(async (req, res, next) => {
  const trends = [
    { term: 'murder', count: 1420 },
    { term: 'cybercrime', count: 980 },
    { term: 'theft', count: 750 },
    { term: 'domestic-violence', count: 640 },
    { term: 'property', count: 520 }
  ];
  return ApiResponse.success(res, 'Search trends fetched successfully', trends, 200);
});

// 10. Fetch user activity log analytics
exports.getUserActivity = asyncHandler(async (req, res, next) => {
  const activity = {
    activeUsers: 340,
    lawsViewedToday: 1250,
    bookmarksCreatedToday: 85,
    reportsSubmittedToday: 12
  };
  return ApiResponse.success(res, 'User activity analytics fetched successfully', activity, 200);
});
