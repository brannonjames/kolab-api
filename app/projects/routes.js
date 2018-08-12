const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('../middleware/auth');
const { getProjects, postProject } = require('./controllers');

router.get('/', ensureLoggedIn, getProjects);
router.post('/', ensureLoggedIn, postProject);

module.exports = router;