const express = require('express');
const router = express.Router();
const {registerRules, loginRules, validate} = require('../middleware/validate.js');
const {register, login} = require('../controllers/userController.js');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

module.exports = router;