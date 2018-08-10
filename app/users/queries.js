const pool = require('../../config/database');
const { hash } = require('../../modules/bcrypt');


exports.createNewUser = async (user) => {
  try {
    const {
      username,
      email
    } = user;

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

    let newUser = await pool.query(`
      SELECT * FROM users
      WHERE username = $1
      AND email = $2
      AND password = $3;
    `, [username, email, password]);


    return {
      id: newUser.rows[0].id,
      username: newUser.rows[0].username,
      email: newUser.rows[0].email
    }
  
  } catch (err) {

    if (err.code === '23505') {
      throw new Error('That email already exists');
    } else {
      return Error('uh oh');
    }

  }
}