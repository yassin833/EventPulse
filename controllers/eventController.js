const { AppError } = require('../middleware/errorHandler.js');
const Event = require('../models/event.model.js');
const Registration = require('../models/registration.model.js');
const { successMessage } = require('../utils/messages.js');

async function createEvent(req, res, next) {
  const {title, description, date, city, capacity} = req.body;
  const userId = req.user._id;
  const event = await Event.create({
    title,
    description,
    date,
    city,
    capacity,
    createdBy: userId
  });
  return successMessage(res, 201, 'Event created successfully', event);
}

async function getEventById(req, res, next) {
  const eventId = req.params.id;
  const event = await Event.findById(eventId).lean();
  if (!event) {
    return next(new AppError('Event specified is not found', 404));
  }
  return successMessage(res, 200, 'Event specified is found!', event);
}

async function updateEvent(req, res, next) {
  const eventId = req.params.id;
  // Edge case: updating capacity to be lower than already booked seats
  const eventToUpdate = await Event.findById(eventId);
  if (!eventToUpdate) {
    return next(new AppError('Event specified is not found', 404));
  }

  if (req.body.capacity !== undefined) {
    // Count attendees through registration docs
    const currentRegistrationsCount = await Registration.countDocuments({
      event: eventId,
      status: 'confirmed'
    });

    if (req.body.capacity < currentRegistrationsCount) {
      return next(new AppError('Requested capacity is not available. Capacity must be greater than already booked seats or equal', 400));
    }
  }

  const allowedUpdates = ['title', 'description', 'date', 'city', 'capacity'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      eventToUpdate[field] = req.body[field];
    }
  });

  await eventToUpdate.save();
  return successMessage(res, 200, 'Event updated successfully', eventToUpdate);
}

async function deleteEvent(req, res, next) {
  const eventId = req.params.id;
  const eventToDelete = await Event.findByIdAndDelete(eventId);
  if (!eventToDelete) {
    return next(new AppError('Event specified is not found', 404));
  }

  await Registration.deleteMany({event: eventId});
  return successMessage(res, 200, 'Event specified is deleted', eventToDelete);
}

async function getAllEvents(req, res, next) {
  const {search, sort, selectStr} = req.query;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  // Filter
  const filter = {};
  if (search) {
    filter.title = {$regex: search, $options: 'i'};
  }

  // Sort
  let sortBy = {createdAt: -1};
  if (sort) {
    const isDescending = sort.startsWith('-');
    const field = isDescending ? sort.substring(1): sort;
    sortBy = {[field]: isDescending ? -1: 1}
  }

  // Select
  let fields = '-__v';
  if (selectStr) {
    fields = selectStr.split(',').map(f => f.trim()).join(' ');
  }

  const [data, totalDocuments] = await Promise.all([
    Event.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sortBy)
      .select(fields)
      .lean(),

    Event.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalDocuments / limit);

  return successMessage(res, 200, 'Events retrieved successfully', {
    events: data,
    pagination: {
      totalDocuments,
      totalPages,
      currentPage: page,
      limit
    }
  });
}

module.exports = {createEvent, getEventById, updateEvent, deleteEvent, getAllEvents};