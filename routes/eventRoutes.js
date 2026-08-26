const express = require('express');
const router = express.Router();
const {createEventRules, updateEventRules, validate} = require('../middleware/validate.js');
const {createEvent, getEventById, updateEvent, deleteEvent, getAllEvents} = require('../controllers/eventController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');

router
  .route('/')
  .post(requireAuth, requireRole('admin'), createEventRules, validate, createEvent)
  .get(getAllEvents)
router
  .route('/:id')
  .get(getEventById)
  .patch(requireAuth, requireRole('admin'), updateEventRules, validate, updateEvent)
  .delete(requireAuth, requireRole('admin'), deleteEvent);

module.exports = router;