const pool = require('../../config/database');
const {
  hash,
  checkPassword,
  createToken
} = require('../../modules/auth');


exports.createNewUser = async (user) => {
  try {

    const { username, email } = user;

    if (!username || !email || !user.password) {
      next({
        status: 400,
        messages: 'Username, Email, and Password required'
      });
    }
  
    let password = await hash(user.password);
  
    await pool.query(`
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3);
    `, [username, email, password]);

    return true;
  
  } catch (err) {

    if (err.code === '23505') {
      throw new Error('That email already exists');
    } else {
      throw new Error(err.message);
    }

  }
}

exports.loginUser = async user => {
  try {

    const { email, password } = user;

    let { rows } = await pool.query(`
      SELECT * from users
      WHERE email = $1;
    `, [email]);

    const foundUser = rows[0];

    if (foundUser) {
      let isCorrectPass = await checkPassword(password, foundUser.password);
      if (foundUser && isCorrectPass) {
        let token = createToken(foundUser.id);
        return {
          token,
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email
        }
      } else {
        throw new Error('Incorrect email/password');
      }
    } else {
      throw new Error('Incorrect email/password');
    }
  } catch (err) {
    throw new Error(err.message);
  }
}