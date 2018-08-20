const pool = require('../../config/database');

exports.createMessage = async (message, projectId, userId) => {
  try {

    let { rows } = await pool.query(`
      INSERT INTO message (text, user_id, project_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [message, userId, projectId]);

    return rows[0];

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.findMessages = async projectId => {
  try {

    let { rows } = await pool.query(`
      SELECT message.id, message.text, message.user_id, "user".username
      FROM message, "user"
      WHERE message.user_id = "user".id
      AND message.project_id = $1;
    `, [projectId]);

    return rows;

  } catch (err) {
    throw new Error(err.message);
  }
}