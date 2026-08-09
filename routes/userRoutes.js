const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/userController.js');
const {protect} = require('../middleware/authMiddleware.js');

router.post('/auth/register', register);
router.post('/auth/login', login);

module.exports = router;