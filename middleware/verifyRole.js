const {AppError} = require('./errorHandler.js');

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not logged in. Please log in', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('User cannot perform this action', 403));
    }

    next();
  }
}

module.exports = verifyRole;