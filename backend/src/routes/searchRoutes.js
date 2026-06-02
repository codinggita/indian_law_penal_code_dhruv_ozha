const express = require('express');
const { searchLaws } = require('../controllers/lawController');

const router = express.Router();

// Mounts GET /api/v1/search/laws?q=...
router.get('/laws', searchLaws);

module.exports = router;
