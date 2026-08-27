const User = require('../models/user.model.js');
const {successMessage} = require('../utils/messages.js');
const {AppError} = require('../middleware/errorHandler.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (id, role) => {
  return jwt.sign({id, role}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
}

async function register(req, res) {
  const {name, email, password} = req.body;
  const user = await User.create({
    name,
    email,
    password
  });
  const userObj = user.toObject();
  delete userObj.password;
  return successMessage(res, 201, 'Account created successfully', userObj);
}

async function login(req, res, next) {
  const {email, password} = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({email}).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id, user.role);
  const userObj = user.toObject();
  delete userObj.password;
  return successMessage(res, 200, 'User logged in successfully', {userObj, token});
}

module.exports = {register, login}