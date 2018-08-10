const { createNewUser, loginUser } = require('./queries');

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