const express = require('express');
const router = express.Router();

const {
  ensureLoggedIn,
  ensureProjectOwner 
} = require('../../middleware/auth');

const {
  getProjects,
  postProject,
  postProjectView,
  putProject
} = require('./controllers');

router.get('/', ensureLoggedIn, getProjects);
router.post('/', ensureLoggedIn, postProject);

router.put('/:project_id', ensureProjectOwner, putProject);

router.post('/:project_id/views', ensureLoggedIn, postProjectView);

module.exports = router;