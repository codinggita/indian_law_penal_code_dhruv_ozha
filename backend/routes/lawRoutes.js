const express = require('express');
const { createLaw, getLaws, getLawById } = require('../controllers/lawController');

const router = express.Router();

router
  .route('/')
  .get(getLaws)
  .post(createLaw);

router
  .route('/:id')
  .get(getLawById);

module.exports = router;
