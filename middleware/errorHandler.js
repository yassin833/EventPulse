const { errorMessage } = require("../utils/messages");
const NODE_ENV = process.env.NODE_ENV;

const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

class AppError extends Error{
  constructor(message, statusCode, stack, data=null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail': 'error';
    this.data = data;
    this.stack = stack;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = err;
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }
  if (err.code === 11000) {
    const value = Object.keys(err.keyValue).join(', ');
    const message = `Duplicate field value entered for: ${value}. Please use another value!`;
    error = new AppError(message, 409);
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }

  const message = error.message || 'Internal server error';
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const data = error.data ?? null;
  let stack;
  if (NODE_ENV === 'development') {
    stack = error.stack;
  }

  return errorMessage(res, statusCode, message, status, stack, data);
}

module.exports = {AppError, errorHandler, asyncHandler};