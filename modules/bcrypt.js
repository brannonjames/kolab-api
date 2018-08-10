const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.hash = async (dataToHash) => {
  try {

    let salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(dataToHash, salt);

  } catch (err) {
    throw new Error('An error has occured');
  }
}