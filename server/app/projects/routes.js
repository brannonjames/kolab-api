const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('../../middleware/auth');
const {
  getProjects,
  postProject,
  postProjectView
} = require('./controllers');

router.get('/', ensureLoggedIn, getProjects);
router.post('/', ensureLoggedIn, postProject);

router.post('/:project_id/views', ensureLoggedIn, postProjectView);

module.exports = router;