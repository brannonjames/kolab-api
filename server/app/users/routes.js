const express = require('express');
const router = express.Router();
const { checkIdentity, ensureLoggedIn } = require('../../middleware/auth');

const {
  registerUser,
  loginUser,
  getLoggedInUser,
  getUserProjects
} = require('./controllers');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// User Actions
router.get('/projects', ensureLoggedIn, getUserProjects);
router.get('/:user_id', checkIdentity, getLoggedInUser);


module.exports = router;