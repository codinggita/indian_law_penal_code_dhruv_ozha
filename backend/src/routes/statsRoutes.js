const express = require('express');
const {
  getTotalCount,
  getActiveCount,
  getRepealedCount,
  getByAct,
  getByCategory,
  getByState,
  getByCourt,
  getRecentStats,
  getTrendingStats,
  getBookmarkStats
} = require('../controllers/statsController');

const router = express.Router();

router.get('/laws/count', getTotalCount);
router.get('/laws/active', getActiveCount);
router.get('/laws/repealed', getRepealedCount);
router.get('/laws/by-act', getByAct);
router.get('/laws/by-category', getByCategory);
router.get('/laws/by-state', getByState);
router.get('/laws/by-court', getByCourt);
router.get('/laws/recent', getRecentStats);
router.get('/laws/trending', getTrendingStats);
router.get('/laws/bookmarks', getBookmarkStats);

module.exports = router;
