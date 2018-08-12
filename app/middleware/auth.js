const jwt = require('jwt-simple');
const { getUser } = require('../users/queries');

exports.checkIdentity = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token, process.env.JWT_KEY);
    let user = await getUser(req.params.user_id);

    if (!user) {
      next({ message: 'user not found', status: 400 });
    }

    if (decoded.sub !== user.id) {
      next({ message: 'You are not authorized to do that' });
    }

    res.locals.user = user;
    next();

  } catch (err) {
    next(err);
  }
}