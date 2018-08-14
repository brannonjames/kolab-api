const pool = require('../../config/database');
const {
  hash,
  checkPassword,
  createToken
} = require('../../modules/auth');


exports.createNewUser = async (user) => {
  try {

    const { username, email } = user;

    // throw error if fields don't exist
    // will add more validation later
    if (!username || !email || !user.password) {
      throw new Error('Username, Email, and Password required');
    }
  
    // take incoming password and hash it 
    let password = await hash(user.password);
  
    // actually add new user to database assuming all validation passed
    await pool.query(`
      INSERT INTO "user" (username, email, password)
      VALUES ($1, $2, $3);
    `, [username, email, password]);

    return true;
  
  } catch (err) {

    // error code 23505 comes from pg when a UNIQUE validator fails
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
      SELECT * from "user"
      WHERE email = $1;
    `, [email]);

    const foundUser = rows[0];

    if (foundUser) {
      let isCorrectPass = await checkPassword(password, foundUser.password);
      if (isCorrectPass) {

        // create a token containing the user id and a timestamp
        let token = createToken(foundUser.id);

        // return user object and token for storage on client
        return {
          token,
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email
        }
      } else {
        // throw error if incorrect password
        let error = new Error('Incorrect email/password');
        error.status = 499;
        console.log(error);
        throw error;
      }
    } else {
      // throw same error is no user was found
      throw new Error('Incorrect email/password');
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

exports.getUser = async id => {
  try {

    let { rows } = await pool.query(`
      SELECT id, username, email FROM "user"
      WHERE id = $1;
    `, [id]);

    return rows[0];

  } catch (err) {
    console.log(err);
  }
}