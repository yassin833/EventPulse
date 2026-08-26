const Registration = require('../models/registration.model.js');
const Event = require('../models/event.model.js');
const {AppError} = require('../middleware/errorHandler.js');
const {successMessage} = require('../utils/messages.js');

async function registerForEvent(req, res, next) {
  const eventId = req.body.eventId;
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
    let isOperational = true;
    const currentRegistrationsCount = await Registration.countDocuments({
      event: eventId,
      status: 'confirmed'
    });  
    if (currentRegistrationsCount >= eventToRegister.capacity) {
      isOperational = false;
      
    }
    return isOperational;
  }
  if (!registeredDoc) {
    const isOperational = await checkCapacity();
    if (!isOperational) {
      return next(new AppError('Event is full', 400));
    }
    const eventRegistered = await Registration.create({
      user: userId,
      event: eventId
    });
    return successMessage(res, 201, 'Registration is successful', eventRegistered);
  }
  else {
    if (registeredDoc.status === 'confirmed') {
      return next(new AppError('Already registered', 400));
    }
    const isOperational = await checkCapacity();
    if (!isOperational) {
      return next(new AppError('Event is full', 400));
    }
    // Capacity is not full and the attendee has not registered
    registeredDoc.status = 'confirmed';
    await registeredDoc.save();
    return successMessage(res, 200, 'Registration is successful', registeredDoc);
  }
}

async function getMyReg(req, res) {
  const userId = req.user._id;
  const myEventsFilter = {user: userId, status: 'confirmed'};
  const myEvents = await Registration.find(myEventsFilter).populate('event');
  return successMessage(res, 200, 'All of your registrations are retrieved', myEvents);
}

async function deleteMyReg(req, res, next) {
  // This implementation of the project uses soft-delete and not hard-delete
  const regId = req.params.id;
  const userId = req.user._id;
  const regToDelete = await Registration.findOneAndUpdate({
    _id: regId,
    user: userId,
    status: 'confirmed'
  }, {status: 'cancelled'});
  if (!regToDelete) {
    // 404 only is intentionally chosen
    // So that intruders aren't capable of whether the reg doesn't exist or belongs to someone else
    return next(new AppError('Registration not found or belongs to another user!', 404));
  }
  return successMessage(res, 200, 'Registration deleted successfully', null);
}

module.exports = {registerForEvent, getMyReg, deleteMyReg};