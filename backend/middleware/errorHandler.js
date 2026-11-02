const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = `Resource not found with ID of ${err.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(". ");
    statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token, please login again";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired, please login again";
    statusCode = 401;
  }

  // Only log stack trace if it's an unexpected 500 error or in development
  if (statusCode === 500 || process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
