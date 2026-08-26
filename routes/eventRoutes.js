const express = require('express');
const router = express.Router();
const {createEventRules, updateEventRules, getEventsRules, validate} = require('../middleware/validate.js');
const {createEvent, getEventById, updateEvent, deleteEvent, getAllEvents} = require('../controllers/eventController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date }
 *               city: { type: string }
 *               venue: { type: string }
 *               capacity: { type: integer }
 *               category: { type: string }
 *     responses:
 *       201:
 *         description: Event created
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation failed
 *   get:
 *     summary: List all events with filtering, sorting, and pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: mongoId
 *         description: Filter events by category
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter events by city
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, registrations]
 *           default: date
 *         description: Field to sort by date or registrations only
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sorting order
 *       - in: query
 *         name: search
 *         schema:
 *            type: string
 *         description: Search by title or description
 *       - in: query
 *         name: date
 *         schema:
 *            type: string
 *         description: Filter by date (YYYY-MM-DD or full ISO-8601 timestamp)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: date
 *         description: Set a final date to end searching at
 *       - in: query
 *         name: selectStr
 *         schema:
 *           type: string
 *         description: Select certain fields to be projected
 *     responses:
 *       200:
 *         description: Paginated list of events
 *       422:
 *         description: Invalid query parameters
 */
router
  .route('/')
  .post(requireAuth, requireRole('admin'), createEventRules, validate, createEvent)
  .get(getEventsRules, validate, getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
 *   patch:
 *     summary: Update an event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               date: { type: string, format: date }
 *               capacity: { type: integer }
 *     responses:
 *       200:
 *         description: Event updated
 *       422:
 *         description: Validation failed
 *   delete:
 *     summary: Delete an event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event deleted
 *       404:
 *         description: Event not found
 */
router
  .route('/:id')
  .get(getEventById)
  .patch(requireAuth, requireRole('admin'), updateEventRules, validate, updateEvent)
  .delete(requireAuth, requireRole('admin'), deleteEvent);

module.exports = router;