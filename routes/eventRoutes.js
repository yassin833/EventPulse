const express = require('express');
const router = express.Router();
const {createEvent, getEventById, updateEvent, deleteEvent, getAllEvents} = require('../controllers/eventController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');

router
  .route('/')
  .post(requireAuth, requireRole('admin'), createEvent)
  .get(getAllEvents)
router
  .route('/:id')
  .get(getEventById)
  .post(requireAuth, requireRole('admin'), createEvent)
  .patch(requireAuth, requireRole('admin'), updateEvent)
  .delete(requireAuth, requireRole('admin'), deleteEvent);

module.exports = router;