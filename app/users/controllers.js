const { createNewUser } = require('./queries');

exports.registerUser = async (req, res, next) => {
  try {

    await createNewUser(req.body);
    res.sendStatus(201);

  } catch (err) {

    console.log(err.status);

    next(err);

  }
}