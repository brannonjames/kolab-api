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

    newProject.technologies = newProject.technologies.map(tech => JSON.parse(tech));

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

    let { rows } = await pool.query(`
      SELECT * FROM project
      WHERE id = $1;
    `, [project_id]);

    return rows[0];

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.checkOwnerStatus = async (userId, projectId) => {
  try {

    let { rows } = await pool.query(`
      SELECT owner FROM project_user
      WHERE user_id = $1
      AND project_id = $2;
    `, [userId, projectId]);

    if (rows[0] && rows[0].owner) {
      return true;
    } else {
      return false;
    }

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.checkCollaboratorStatus = async (userId, projectId) => {
  try {

    let { rows } = await pool.query(`
      SELECT collaborator FROM project_user
      WHERE user_id = $1
      AND project_id = $2
      AND collaborator = TRUE;
    `, [userId, projectId])

    if (rows[0] && rows[0].collaborator) {
      return true;
    } else {
      return false;
    }

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.updateProject = async project => {
  try {
    const { id, title, technologies, description } = project;

    let { rows } = await pool.query(`
      UPDATE project
      SET title = $1,
          technologies = $2,
          description = $3
      WHERE id = $4
      RETURNING *;   
    `, [title, technologies, description, id]);

    return rows[0];

  } catch (err) {
    throw new Error(err.message);
  }
}

exports.removeProject = async id => {
  try {

    await pool.query(`
      DELETE FROM project_user
      WHERE project_id = $1;
    `, [id]);

    let { rows } = await pool.query(`
      DELETE FROM project
      WHERE id = $1
      RETURNING id; 
    `, [id]);

    return rows[0];

  } catch (err) {
    throw new Error(err.message);
  }
}