const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');
const {createAnnouncements, getAnnouncements} = require('../controllers/announceController.js');

router.post('/', requireAuth, requireRole('admin'), createAnnouncements);
router.get('/:eventId', requireAuth, getAnnouncements);

module.exports = router;