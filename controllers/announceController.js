const Message = require('../models/message.model.js');
const Event = require('../models/event.model.js');
const {AppError} = require('../middleware/errorHandler.js');
const {successMessage} = require('../utils/messages.js');

async function createAnnouncements(req, res, next) {
  const io = req.app.get('io');
  const {event, text} = req.body;
  const sender = req.user._id;

  const eventToCheck = await Event.findById(event);
  if (!eventToCheck) {
    return next(new AppError('Event specified is not found!', 404));
  }
  const announcement = await Message.create({
    event,
    sender,
    text
  });
  io.to(`event_${event}`).emit('announcement', {
    announcement
  });
  return successMessage(res, 201, 'Announcement was sent successfully', announcement);
}

async function getAnnouncements(req, res, next) {
  const eventId = req.params.eventId;
  const announcements = await Message.find({event: eventId}).sort({createdAt: 1}).populate('sender');
  return successMessage(res, 200, 'All announcements are retrieved', announcements);
}

module.exports = {createAnnouncements, getAnnouncements};