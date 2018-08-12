const { findAllProjectsNotViewed } = require('./queries');

exports.getProjects = async (req, res, next) => {
  try {

    // find all the projects the user hasn't seen before
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