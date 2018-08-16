const jwtAuth = require('socketio-jwt-auth');
const secret = process.env.JWT_KEY;

const { getUser } = require('../../app/users/queries');
const { checkCollaboratorStatus } = require('../../app/projects/queries');

exports.ensureLoggedIn = jwtAuth.authenticate({ secret: secret }, async (payload, done) => {
  try {

    if (payload && payload.sub) {

      let user = await getUser(payload.sub);

      if (!user) done({ message: 'Authorization Error' });

      return done(null, user)

    }

  } catch (err) {
    done(err);
  }
});

exports.ensureProjectCollaborator = async (socket, next) => {
  try {

    const user = socket.request.user
    const projectId = socket.handshake.query.project_id;
  
    let isProjectCollaborator = await checkCollaboratorStatus(user.id, projectId);
    
    if (user.logged_in && isProjectCollaborator) {
  
      socket.join(projectId);
      next();
  
    } else {

      next('Couldn\'t establish connection');
      
    }

  } catch (err) {

    throw new Error(err.message);
  }
}