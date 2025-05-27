// filepath: backend/api-gateway/src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
}
module.exports = errorHandler;