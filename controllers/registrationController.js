const Registration = require('../models/registration.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js');
const {AppError} = require('../middleware/errorHandler.js');
const {successMessage} = require('../utils/messages.js');

async function registerForEvent(req, res, next) {
  const eventId = req.params.id;
  const userId = req.user._id;
  const eventToRegister = await Event.findById(eventId);
  if (!eventToRegister) {
    return next(new AppError('Event specified is not found!', 404));
  }

  const registeredDoc = await Registration.findOne({
    event: eventId,
    user: userId
  });

  // If the capacity is full (edge case)
  // Check for capacity after checking the existence of the user's registration
  // To distinguish between the message 'Already registered' and 'Event is full'
  async function checkCapacity() {
    const currentRegistrationsCount = await Registration.countDocuments({
      event: eventId
    });  
    if (currentRegistrationsCount === eventToRegister.capacity) {
      return next(new AppError('Event is full', 400));
    }
  }
  if (!registeredDoc) {
    checkCapacity();
    const eventRegistered = await Registration.create({
      user: userId,
      event: eventId
    });
  }
  else {
    if (registeredDoc.status === 'confirmed') {
      return next(new AppError('Already registered', 400));
    }
    checkCapacity();
    // Capacity is not full and the attendee has not registered
    registeredDoc.status = 'confirmed';
    await registeredDoc.save();
  }
  return successMessage(res, 201, 'Registration is successful', registeredDoc);
}

module.exports = {registerForEvent};