const express = require('express');
const { 
  createLaw, 
  getLaws, 
  getLawById, 
  updateLaw, 
  deleteLaw,
  getDistinctActs,
  getChaptersByAct,
  getLawsByAct
} = require('../controllers/lawController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Advanced routes (Must be defined before /:id)
router.route('/acts').get(getDistinctActs);
router.route('/acts/:actName').get(getLawsByAct);
router.route('/acts/:actName/chapters').get(getChaptersByAct);

router
  .route('/')
  .get(getLaws)
  .post(protect, authorize('admin'), createLaw);

router
  .route('/:id')
  .get(getLawById)
  .put(protect, authorize('admin'), updateLaw)
  .delete(protect, authorize('admin'), deleteLaw);

module.exports = router;
