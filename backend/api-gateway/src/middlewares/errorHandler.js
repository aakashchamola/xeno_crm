// filepath: backend/api-gateway/src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  // Log full error server-side
  console.error(err);
  // Only show detailed error in development
  const isDev = process.env.NODE_ENV === 'development';
  const errorResponse = {
    error: err.message || 'Internal Server Error',
  };
  if (isDev && err.stack) {
    errorResponse.stack = err.stack;
  }
  // Optionally add request ID if available
  if (req.id) errorResponse.requestId = req.id;
  res.status(err.status || 500).json(errorResponse);
}
module.exports = errorHandler;