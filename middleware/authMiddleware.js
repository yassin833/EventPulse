const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const AppError = require('./errorHandler.js');
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return next(new AppError('User not logged in. Please log in', 401));
  }
  token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }
    req.user = user;
    next();
  } catch(err) {
    return next(new AppError('Token is invalid or has expired', 401));
  }
}

module.exports = {protect};