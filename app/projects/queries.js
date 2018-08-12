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

exports.findAllProjects = async () => {
  try {

    let { rows } = await pool.query(`
      SELECT * FROM project;
    `);

    return rows;

  } catch(err) {
    throw new Error(err.message);
  }
}

exports.createProject = async project => {
  try {
    const { title, technologies, description } = project;
  
    await pool.query(`
      INSERT INTO project (title, technologies, description)
      VALUES ($1, $2, $3);
    `, [title, technologies, description]);

    return true;

  } catch (err) {
    throw new Error(err.message);
  }
}