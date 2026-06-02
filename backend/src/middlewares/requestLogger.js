function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    if (process.env.NODE_ENV === 'production' && process.env.DEBUG_HTTP_LOGS !== 'true') {
      return;
    }

    const durationMs = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
}

module.exports = requestLogger;
