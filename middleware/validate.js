const {body, param, validationResult} = require('express-validator');
const {AppError} = require('./errorHandler.js');

const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Please add a name')
    .bail()
    .isLength({
      min: 2,
      max: 32
    })
    .withMessage('Name must be at least 2 characters and at most 32 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Please add an email')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters')
];

const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Please enter your password')
];

const createEventRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Please add an event title'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Please add a description')
    .bail()
    .isLength({
      min: 5,
      max: 100
    })
    .withMessage('Description must be between 5 characters and 100 characters'),
  body('date')
    .isISO8601()
    .withMessage('This is not a valid date'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('Please add a city'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Please add a venue'),
  body('capacity')
    .notEmpty()
    .withMessage('Please specify event capacity')
    .bail()
    .isInt({min: 1})
    .withMessage('Capacity must be at least one'),
  body('category')
    .isMongoId()
    .withMessage('Invalid category ID')
];

const updateEventRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID'),
  body('title')
    .optional()
    .trim(),
  body('description')
    .optional()
    .isLength({
      min: 5,
      max: 100
    })
    .withMessage('Description must be between 5 characters and 100 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('This is not a valid date'),
  body('city')
    .trim(),
  body('venue')
    .trim(),
  body('capacity')
    .optional()
    .isInt({min: 1})
    .withMessage('Capacity must be at least one'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID')
];

const registrationRules = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID')
];

const messageRules = [
  body('event')
    .isMongoId()
    .withMessage('Invalid event ID'),
  body('text')
    .trim()
    .exists()
    .isString()
    .withMessage('Invalid value for text, must be text')
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg);
    return next(new AppError('Validation failed', 422, undefined, messages));
  }
  next();
}

module.exports = {
  validate,
  registerRules, 
  loginRules, 
  createEventRules, 
  updateEventRules, 
  registrationRules,
  messageRules
};