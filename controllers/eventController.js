const { AppError } = require('../middleware/errorHandler.js');
const Event = require('../models/event.model.js');
const Registration = require('../models/registration.model.js');
const { successMessage } = require('../utils/messages.js');

async function createEvent(req, res) {
  const {title, description, date, city, capacity, category, venue} = req.body;
  const userId = req.user._id;
  const event = await Event.create({
    title,
    description,
    date,
    city,
    venue,
    capacity,
    category,
    createdBy: userId
  });
  return successMessage(res, 201, 'Event created successfully', event);
}

async function getEventById(req, res, next) {
  const eventId = req.params.id;
  const event = await Event.findById(eventId).populate().lean();
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

  const allowedUpdates = ['title', 'description', 'date', 'city', 'venue', 'capacity', 'category'];
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

async function getAllEvents(req, res) {
  const {search, category, city, startDate, endDate, sortBy, order, selectStr} = req.query;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  function filterString(strObj) {
    const filter = {};
    const allowedQueries = ['search', 'category', 'city', 'startDate', 'endDate'];
    for (const [key, value] of Object.entries(strObj)) {
      if (allowedQueries.includes(key) && value) {
        if (key === 'startDate' || key === 'endDate') {
          filter.date = {};
          if (startDate) filter.date.$gte = new Date(startDate);
          if (endDate) filter.date.$lt = new Date(endDate);
          continue;
        }
        else if (key === 'search') {
          filter.$or = [
            {title: {$regex: search, $options: 'i'}},
            {description: {$regex: search, $options: 'i'}}
          ];
          continue;
        }
        filter[key] = {$regex: value, $options: 'i'};
      }
    }
    return filter;
  }

  // Filter
  const filter = filterString({search, category, city, startDate, endDate});

  // Sort
  const allowedFields = ['date', 'registrations'];
  const sortField = allowedFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;
  const sort = {[sortField]: sortDirection};

  // Select
  let fields = '-__v';
  if (selectStr) {
    fields = selectStr.split(',').map(f => f.trim()).join(' ');
  }


  let data;
  let totalDocuments;
  if (sortField === 'registrations') {
    const aggregate = Event.aggregate();
    [data, totalDocuments] = await Promise.all([
      aggregate.match(filter)
      .lookup({from: 'registrations', localField: '_id', foreignField: 'event', pipeline: [{ $match: { status: 'confirmed' } }], as: 'registrations'})
      .addFields({
        registrations: {$size: '$registrations'}
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .project(fields),
      
      Event.countDocuments(filter)
    ]);
  }

  else {
    [data, totalDocuments] = await Promise.all([
      Event.find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .select(fields)
        .lean(),

      Event.countDocuments(filter)
    ]);
  }

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