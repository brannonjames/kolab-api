const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('../middleware/auth');
const { getProjects } = require('./controllers');

router.get('/', ensureLoggedIn, getProjects);

module.exports = router;