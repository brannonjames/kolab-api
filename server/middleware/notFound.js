module.exports = async (req, res, next) => {
  next({
    status: 404,
    message: 'This route does not exist!'
  });
}