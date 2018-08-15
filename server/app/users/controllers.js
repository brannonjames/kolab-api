const { createNewUser, loginUser, findUserProjects } = require('./queries');

exports.registerUser = async (req, res, next) => {
  try {

    await createNewUser(req.body);
    res.sendStatus(201);

  } catch (err) {
    next(err);
  }
}

exports.loginUser = async (req, res, next) => {
  try {

    let user = await loginUser(req.body);
    res.send(user);

  } catch (err) {
     next(err); 
  }
}

exports.getLoggedInUser = (req, res, next) => {
  res.send(req.user);
}

exports.getUserProjects = async (req, res, next) => {
  try {

    let projects = await findUserProjects(req.user.id);
    res.send(projects);

  } catch (err) {

    next(err);
  }
}