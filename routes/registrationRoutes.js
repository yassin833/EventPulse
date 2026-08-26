const express = require('express');
const router = express.Router();
const {registrationRules, validate} = require('../middleware/validate.js');
const {registerForEvent, getMyReg, deleteMyReg} = require('../controllers/registrationController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const requireRole = require('../middleware/verifyRole.js');

router.post('/', requireAuth, requireRole('attendee'), registrationRules, validate, registerForEvent);
router.get('/my', requireAuth, getMyReg);
router.delete('/:id', requireAuth, deleteMyReg);

module.exports = router;