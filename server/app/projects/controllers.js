const { 
  findAllProjectsNotViewed,
  createProject,
  createProjectView,
  updateProject,
  removeProject
} = require('./queries');

exports.getProjects = async (req, res, next) => {
  try {

    // find all the projects the user hasn't seen before
    // switch to findAllProjects() to get projects without filtering
    let projects = await findAllProjectsNotViewed(req.user.id);

    if (projects.length === 0) {
      // for rendering a 'no more cards' card on the swipe deck
      res.send([{
        title: 'No more projects',
        description: 'Maybe try creating a new one :)'
      }]);

    } else {
      res.send(projects);
    }

  } catch (err) {
    next(err);
  }
}

exports.postProject = async (req, res, next) => {
  try {

    await createProject(req.body, req.user.id);
    res.sendStatus(201);

  } catch (err) {
    next(err);
  }
}

exports.postProjectView = async (req, res, next) => {
  try {

    const { project_id } = req.params;
    const { liked } = req.query;
    const { id } = req.user;

    await createProjectView(project_id, id, liked);
    res.sendStatus(201);

  } catch (err) {
    next(err);
  }
}

exports.putProject = async (req, res, next) => {
  try {

    let updatedProject = await updateProject(req.body);
    res.send(updatedProject);

  } catch (err) {
    next(err);
  }
}

exports.deleteProject = async (req, res, next) => {
  try {

    let deletedProjectId = await removeProject(req.params.project_id);
    res.send(deletedProjectId);

  } catch (err) {
    next(err);
  }
}