const pool = require('../../config/database');

// the initial plan for the app is to load all the projects the current user has not seen
// so this query method filters out any seen projects based on the current user's id
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

// Mostly just in case I find a reason to load all of the projects
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

// creates the projects, and adds a row to the project_user junction table based
// on the current user's id
exports.createProject = async (project, userId) => {
  try {
    const { title, technologies, description } = project;
  
    let query = await pool.query(`
      INSERT INTO project (title, technologies, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [title, technologies, description]);

    const newProject = query.rows[0];

    await pool.query(`
      INSERT INTO project_user (project_id, user_id, collaborator, owner)
      VALUES ($1, $2, $3, $4);
    `, [newProject.id, userId, true, true]);

    return newProject;

  } catch (err) {
    throw new Error(err.message);
  }
}

// insets a 'view' into the project_user table
// this is to keep track of project views, collaborators, and creators
exports.createProjectView = async (project_id, id, liked) => {
  try {

    await pool.query(`
      INSERT INTO project_user (project_id, user_id, collaborator)
      VALUES ($1, $2, $3);
    `, [project_id, id, liked]);

    return true;

  } catch (err) {
    throw new Error(err.message);
  }
}