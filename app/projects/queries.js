const pool = require('../../config/database');

exports.findAllProjectsNotViewed = async userId => {
  try {

    let { rows } = await pool.query(`
      SELECT * FROM project
      WHERE project.id NOT
      IN (
        SELECT project_user.project_id
        FROM project_user
        WHERE project_user.user_id = $1
      );
    `, [userId]);

    return rows;

  } catch(err) {
    throw new Error(err.message);
  }
}