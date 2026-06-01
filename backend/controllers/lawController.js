const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Law = require('../models/Law');

// @desc    Create a new law section
// @route   POST /api/v1/laws
// @access  Private (Admin only)
exports.createLaw = asyncHandler(async (req, res, next) => {
  const law = await Law.create(req.body);
  res.status(201).json({ success: true, data: law });
});

// @desc    Get all law sections
// @route   GET /api/v1/laws
// @access  Public
exports.getLaws = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  let queryObj = JSON.parse(queryStr);

  if (req.query.search) {
    queryObj.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { section: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  let query = Law.find(queryObj);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('act section');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const laws = await query;
  const total = await Law.countDocuments();
  const pagination = {};

  if (skip + limit < total) { pagination.next = { page: page + 1, limit }; }
  if (skip > 0) { pagination.prev = { page: page - 1, limit }; }

  res.status(200).json({ success: true, count: laws.length, pagination, data: laws });
});

// @desc    Get a single law section by ID
// @route   GET /api/v1/laws/:id
// @access  Public
exports.getLawById = asyncHandler(async (req, res, next) => {
  const law = await Law.findById(req.params.id);
  if (!law) {
    return next(new ErrorResponse(`Law section not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: law });
});

// @desc    Update a law section
// @route   PUT /api/v1/laws/:id
// @access  Private (Admin only)
exports.updateLaw = asyncHandler(async (req, res, next) => {
  let law = await Law.findById(req.params.id);
  if (!law) {
    return next(new ErrorResponse(`Law section not found with id of ${req.params.id}`, 404));
  }
  
  law = await Law.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: law });
});

// @desc    Delete a law section
// @route   DELETE /api/v1/laws/:id
// @access  Private (Admin only)
exports.deleteLaw = asyncHandler(async (req, res, next) => {
  const law = await Law.findById(req.params.id);
  if (!law) {
    return next(new ErrorResponse(`Law section not found with id of ${req.params.id}`, 404));
  }
  
  await law.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get all distinct acts
// @route   GET /api/v1/laws/acts
// @access  Public
exports.getDistinctActs = asyncHandler(async (req, res, next) => {
  const acts = await Law.distinct('act');
  res.status(200).json({ success: true, data: acts });
});

// @desc    Get all chapters for a specific act
// @route   GET /api/v1/laws/acts/:actName/chapters
// @access  Public
exports.getChaptersByAct = asyncHandler(async (req, res, next) => {
  const actName = req.params.actName;
  const chapters = await Law.aggregate([
    { $match: { act: new RegExp(`^${actName}$`, 'i'), chapter: { $ne: null } } },
    { $group: { _id: "$chapter", chapter_title: { $first: "$chapter_title" } } },
    { $sort: { _id: 1 } }
  ]);
  res.status(200).json({ success: true, count: chapters.length, data: chapters });
});

// @desc    Get all laws for a specific act
// @route   GET /api/v1/laws/acts/:actName
// @access  Public
exports.getLawsByAct = asyncHandler(async (req, res, next) => {
  const actName = req.params.actName;
  const laws = await Law.find({ act: new RegExp(`^${actName}$`, 'i') });
  res.status(200).json({ success: true, count: laws.length, data: laws });
});

// @desc    Get analytics and statistics for laws
// @route   GET /api/v1/laws/analytics
// @access  Public
exports.getLawAnalytics = asyncHandler(async (req, res, next) => {
  const totalLaws = await Law.countDocuments();
  const lawsPerAct = await Law.aggregate([
    { $group: { _id: '$act', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const totalChaptersData = await Law.aggregate([
    { $match: { chapter: { $ne: null } } },
    { $group: { _id: { act: '$act', chapter: '$chapter' } } },
    { $count: 'totalChapters' }
  ]);
  const totalChapters = totalChaptersData.length > 0 ? totalChaptersData[0].totalChapters : 0;

  res.status(200).json({
    success: true,
    data: { totalLaws, totalActs: lawsPerAct.length, totalChapters, lawsPerAct }
  });
});
