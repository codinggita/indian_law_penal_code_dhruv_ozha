const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');
const {
  loggerPractice,
  cachePractice,
  requestTimePractice,
  securityPractice,
  corsPractice,
  compressionPractice,
  validationPractice
} = require('../middlewares/practiceMiddlewares');

const router = express.Router();

// 1. Logger practice route
router.get('/logger', loggerPractice, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logger practice route executed successfully (Header and console logs set).'
  });
});

// 2. Auth practice route
router.get('/auth', protect, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Auth practice route passed successfully (User authorized).',
    user: req.user
  });
});

// 3. Cache practice route
router.get('/cache', cachePractice, (req, res) => {
  const data = {
    currentTime: new Date().toISOString(),
    randomValue: Math.random().toString(36).substring(7),
    tip: 'Requests within 10 seconds will trigger cache HIT and bypass this generation.'
  };
  return res.status(200).json({
    success: true,
    message: 'Cache practice route generated fresh data.',
    data
  });
});

// 4. Rate-limit practice route
router.get('/rate-limit', rateLimiter, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Rate limiting check passed successfully (Request allowed within quota).'
  });
});

// 5. Error-handler practice route
router.get('/error-handler', (req, res, next) => {
  const practiceError = new Error('This is a simulated practice error to test the global error middleware.');
  practiceError.statusCode = 418; // I'm a teapot!
  next(practiceError);
});

// 6. Request timing practice route
router.get('/request-time', requestTimePractice, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Request timing practice passed.',
    requestTime: req.requestTime
  });
});

// 7. Security headers practice route
router.get('/security', securityPractice, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Security headers practice route executed successfully (Response headers populated).'
  });
});

// 8. CORS practice route
router.get('/cors', corsPractice, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'CORS practice route executed successfully (Access headers set).'
  });
});

// 9. Compression practice route
router.get('/compression', compressionPractice, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Compression practice route executed successfully (Encoding headers set).'
  });
});

// 10. Validation practice route
router.get('/validation', validationPractice, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Validation practice route executed successfully (Input parameter checked).',
    paramsReceived: req.query
  });
});

module.exports = router;
