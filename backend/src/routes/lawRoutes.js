const express = require('express');
const {
  getAllLaws,
  getRecentLaws,
  getTrendingLaws,
  getArchivedLaws,
  getLawStats,
  getLawById,
  getLawExistsById,
  getRandomLaw,
  getLawSummary,
  getLawHistory,
  createLaw,
  updateLaw,
  archiveLaw,
  restoreLaw,
  deleteLaw
} = require('../controllers/lawController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Mount modular sub-filters route
router.use('/filter', require('./filterRoutes'));

// Basic Collection Queries & Operations
router.get('/stats/overview', getLawStats);
router.get('/recent', getRecentLaws);
router.get('/trending', getTrendingLaws);
router.get('/archived', getArchivedLaws);
router.get('/random', getRandomLaw);

// Collection CRUD Operations
router.route('/')
  .get(getAllLaws)
  .post(protect, authorize('admin'), createLaw);

router.get('/exists/:id', getLawExistsById);
router.get('/:id/history', getLawHistory);
router.get('/:id/summary', getLawSummary);
router.patch('/:id/archive', protect, authorize('admin'), archiveLaw);
router.patch('/:id/restore', protect, authorize('admin'), restoreLaw);

router.route('/:id')
  .get(getLawById)
  .put(protect, authorize('admin'), updateLaw)
  .patch(protect, authorize('admin'), updateLaw)
  .delete(protect, authorize('admin'), deleteLaw);

module.exports = router;
