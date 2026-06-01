const Law = require('../models/Law');

// @desc    Create a new law section
// @route   POST /api/v1/laws
// @access  Public (Will be protected later)
exports.createLaw = async (req, res) => {
  try {
    const law = await Law.create(req.body);
    res.status(201).json({
      success: true,
      data: law
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all law sections
// @route   GET /api/v1/laws
// @access  Public
exports.getLaws = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const laws = await Law.find().skip(skip).limit(limit);

    // Pagination result
    const total = await Law.countDocuments();
    const pagination = {};

    if (skip + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (skip > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: laws.length,
      pagination,
      data: laws
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get a single law section by ID
// @route   GET /api/v1/laws/:id
// @access  Public
exports.getLawById = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);
    if (!law) {
      return res.status(404).json({
        success: false,
        message: 'Law section not found'
      });
    }
    res.status(200).json({
      success: true,
      data: law
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a law section
// @route   PUT /api/v1/laws/:id
// @access  Public (Will be protected later)
exports.updateLaw = async (req, res) => {
  try {
    let law = await Law.findById(req.params.id);
    if (!law) {
      return res.status(404).json({
        success: false,
        message: 'Law section not found'
      });
    }
    
    law = await Law.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: law
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a law section
// @route   DELETE /api/v1/laws/:id
// @access  Public (Will be protected later)
exports.deleteLaw = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);
    if (!law) {
      return res.status(404).json({
        success: false,
        message: 'Law section not found'
      });
    }
    
    await law.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all distinct acts
// @route   GET /api/v1/laws/acts
// @access  Public
exports.getDistinctActs = async (req, res) => {
  try {
    const acts = await Law.distinct('act');
    res.status(200).json({
      success: true,
      data: acts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all chapters for a specific act
// @route   GET /api/v1/laws/acts/:actName/chapters
// @access  Public
exports.getChaptersByAct = async (req, res) => {
  try {
    const actName = req.params.actName;
    const chapters = await Law.aggregate([
      { $match: { act: new RegExp(`^${actName}$`, 'i'), chapter: { $ne: null } } },
      { $group: { _id: "$chapter", chapter_title: { $first: "$chapter_title" } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all laws for a specific act
// @route   GET /api/v1/laws/acts/:actName
// @access  Public
exports.getLawsByAct = async (req, res) => {
  try {
    const actName = req.params.actName;
    const laws = await Law.find({ act: new RegExp(`^${actName}$`, 'i') });
    
    res.status(200).json({
      success: true,
      count: laws.length,
      data: laws
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
