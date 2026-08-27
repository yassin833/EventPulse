const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/user.model.js');

async function requireSocketAuth(socket, next) {
  if (!socket.handshake.auth.token && !socket.handshake.query.token) {
    const err = new Error('Unauthorized');
    err.data = {content: 'Please login again'};
    return next(err);
  }
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error('The user belonging to this token no longer exists');
      err.data = {content: 'Please try again later'};
      return next(err);
    }
    socket.user = user;
    next();
  } catch(err) {
    if (err.name === 'TokenExpiredError') {
      const err = new Error('User token is expired');
      err.data = {content: 'Please log in again'}
      return next(err);
    } else {
      const err = new Error('Token is invalid');
      err.data = {content: 'Plesage log in again'};
      return next(err);
    }
  }
}

module.exports = requireSocketAuth;