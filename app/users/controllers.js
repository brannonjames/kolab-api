const { createNewUser } = require('./queries');

exports.registerUser = async (req, res, next) => {
  try {

    const user = await createNewUser(req.body);
    res.send(user);

  } catch (err) {

    console.log(err.status);

    next(err);

  }
}