const jwt = require('jwt-simple');
const { getUser } = require('../users/queries');

// application level middleware

exports.handleAuth = async (req, res, next) => {
  try {

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const { sub } = jwt.decode(token, process.env.JWT_KEY);
      const user = await getUser(sub);

      if (!user) { throw Error() }

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