const express = require('express');
const router = express.Router();
const {registerForEvent} = require('../controllers/registrationController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');

router.post('/', requireAuth, requireRole('attendee'), registerForEvent);

module.exports = router;