const express = require('express');
const router = express.Router();
const {registerRules, loginRules, validate} = require('../middleware/validate.js');
const {register, login} = require('../controllers/userController.js');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: Validation failed
 */
router.post('/register', registerRules, validate, register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful, returns user and token
 *       401:
 *         description: Invalid credentials
 *       422:
 *          description: Validation failed
 */
router.post('/login', loginRules, validate, login);

module.exports = router;