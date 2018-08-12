const express = require('express');
const router = express.Router();
const { checkIdentity } = require('../middleware/auth');
const { getLoggedInUser } = require('./controllers');

const {
  registerUser,
  loginUser
} = require('./controllers');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// User Actions
router.get('/:user_id', checkIdentity, getLoggedInUser);

module.exports = router;