const express = require('express');
const router = express.Router();

const {
  registerUser
} = require('./controllers');

// Auth
router.post('/register', registerUser);

module.exports = router;