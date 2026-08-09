const { errorMessage } = require("../utils/messages");
const NODE_ENV = process.env.NODE_ENV;

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
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }
  if (err.code === 11000) {
    const value = Object.keys(err.keyValue).join(', ');
    const message = `Duplicate field value entered for: ${value}. Please use another value!`;
    error = new AppError(message, 400);
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }

  let error = err;
  const message = err.message || 'Internal server error';
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const data = err.data ?? null;
  let stack;
  if (NODE_ENV === 'development') {
    stack = err.stack;
  }

  return errorMessage(res, statusCode, message, status, stack, data);
}

module.exports = {AppError, errorHandler};