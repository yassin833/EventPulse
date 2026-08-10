const express = require('express');
const router = express.Router();
const {createEvent, getEventById, updateEvent, deleteEvent, getAllEvents} = require('../controllers/eventController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const verifyRole = require('../middleware/verifyRole.js');

router
  .route('/')
  .post(requireAuth, verifyRole('admin'), createEvent)
  .get(getAllEvents)
router
  .route('/:id')
  .get(getEventById)
  .post(requireAuth, verifyRole('admin'), createEvent)
  .patch(requireAuth, verifyRole('admin'), updateEvent)
  .delete(requireAuth, verifyRole('admin'), deleteEvent);

module.exports = router;