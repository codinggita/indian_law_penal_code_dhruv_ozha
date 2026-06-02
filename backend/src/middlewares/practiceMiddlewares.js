/**
 * Custom practice middlewares for MERN developer checklists.
 */

// 1. Logger practice middleware
exports.loggerPractice = (req, res, next) => {
  res.setHeader('X-Practice-Logger', 'Active');
  console.log(`[PRACTICE LOGGER] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
};

// 2. Cache practice middleware
const cacheStore = new Map();
exports.cachePractice = (req, res, next) => {
  const cacheKey = req.originalUrl;
  const now = Date.now();
  
  if (cacheStore.has(cacheKey)) {
    const cached = cacheStore.get(cacheKey);
    if (now - cached.timestamp < 10000) { // 10 seconds cache validity
      res.setHeader('X-Practice-Cache', 'HIT');
      return res.status(200).json({
        success: true,
        message: 'Cache HIT (Data served from practice memory cache)',
        cachedAt: new Date(cached.timestamp).toISOString(),
        data: cached.data
      });
    }
  }

  // Intercept response to store it in cache
  const originalJson = res.json;
  res.json = function(body) {
    cacheStore.set(cacheKey, {
      timestamp: Date.now(),
      data: body
    });
    res.setHeader('X-Practice-Cache', 'MISS');
    return originalJson.call(this, body);
  };
  
  next();
};

// 3. Request timing middleware
exports.requestTimePractice = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
};

// 4. Security middleware
exports.securityPractice = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

// 5. CORS practice middleware
exports.corsPractice = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
};

// 6. Compression practice middleware
exports.compressionPractice = (req, res, next) => {
  res.setHeader('Content-Encoding', 'gzip-mock');
  res.setHeader('X-Practice-Compression', 'Simulated GZIP');
  next();
};

// 7. Validation practice middleware
exports.validationPractice = (req, res, next) => {
  const { category, section } = req.query;
  if (!category && !section) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please provide category or section query parameters.'
    });
  }
  next();
};
