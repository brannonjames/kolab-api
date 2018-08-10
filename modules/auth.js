const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const SALT_ROUNDS = 10;

exports.hash = async (dataToHash) => {
  try {

    let salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(dataToHash, salt);

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.checkPassword = async (plainText, hash) => {
  try {

    return await bcrypt.compare(plainText, hash);

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.createToken = userId => {
  return jwt.encode({
    sub: userId,
    iat: Date.now()
  }, process.env.JWT_KEY);
}

exports.decodeToken = token => {
  return jwt.decode(token, process.env.JWT_KEY);
}