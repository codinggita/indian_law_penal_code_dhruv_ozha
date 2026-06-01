const express = require('express');
const { createLaw, getLaws, getLawById, updateLaw, deleteLaw } = require('../controllers/lawController');

const router = express.Router();

router
  .route('/')
  .get(getLaws)
  .post(createLaw);

router
  .route('/:id')
  .get(getLawById)
  .put(updateLaw)
  .delete(deleteLaw);

module.exports = router;
