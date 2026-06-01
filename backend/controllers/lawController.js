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
    const laws = await Law.find();
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
