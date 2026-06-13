const express = require('express');
const {
  filterByAct,
  filterByChapter,
  filterBySection,
  filterByState,
  filterByCourt,
  filterByStatus,
  filterByCategory,
  filterByBailable,
  filterByCognizable,
  filterByPunishmentType,
  getRecentLaws,
  getTrendingLaws
} = require('../controllers/lawController');

const router = express.Router();

router.get('/act/:actName', filterByAct);
router.get('/chapter/:chapterId', filterByChapter);
router.get('/section/:sectionNumber', filterBySection);
router.get('/state/:state', filterByState);
router.get('/court/:courtName', filterByCourt);
router.get('/status/:status', filterByStatus);
router.get('/category/:category', filterByCategory);
router.get('/bailable/:value', filterByBailable);
router.get('/cognizable/:value', filterByCognizable);
router.get('/punishment/:type', filterByPunishmentType);
router.get('/recent', getRecentLaws);
router.get('/trending', getTrendingLaws);

// Additional specific filters requested in specifications
router.get('/high-importance', (req, res, next) => {
  req.query.importance = 'high';
  req.params.actName = undefined;
  return filterByAct(req, res, next);
});

router.get('/repealed', (req, res, next) => {
  req.query.status = 'repealed';
  req.params.actName = undefined;
  return filterByAct(req, res, next);
});

router.get('/constitutional', (req, res, next) => {
  req.params.actName = 'Constitution';
  return filterByAct(req, res, next);
});

module.exports = router;
