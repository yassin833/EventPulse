const express = require('express');
const router = express.Router();
const {messageRules, validate} = require('../middleware/validate.js');
const {createAnnouncements, getAnnouncements} = require('../controllers/announceController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');

router.post('/', requireAuth, requireRole('admin'), messageRules, validate, createAnnouncements);
router.get('/:eventId', requireAuth, getAnnouncements);

module.exports = router;