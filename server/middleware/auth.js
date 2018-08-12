const jwt = require('jwt-simple');
const { getUser } = require('../app/users/queries');

// application level middleware

// decode incoming token, set authenticated user as req.user
exports.handleAuth = async (req, res, next) => {
  try {

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const { sub } = jwt.decode(token, process.env.JWT_KEY);
      const user = await getUser(sub);

      if (!user) { throw Error() }

      // put current user onto request object for the rest of
      // the middleware to use
      req.user = user;
      req.isAuthenticated = true;
  
    } else {

      req.user = null;
      req.isAuthenticated = false;

    }

    next();

  } catch (err) {
    next({
      message: 'Authorization Error',
      status: 401
    });
  }
}

// route level middleware

// still deciding where/if I even want to keep this
// might not be needed with the application level auth middleware
exports.ensureLoggedIn = async (req, res, next) => {
  try {

    if (req.isAuthenticated) {
      next();
    } else {
      next({
        message: 'Authorization Error',
        status: 401
      });
    }
     

  } catch (err) {
    next(err);
  }
}


// when a user refreshes/updates their information this ensures
// they can only retrieve their own information 
exports.checkIdentity = async (req, res, next) => {
  try {

    if (req.user.id === parseInt(req.params.user_id)) {

      next();

    } else {

      next({
        message: 'Authorization Error',
        status: 401
      });

    }

  } catch (err) {
    next(err);
  }
}