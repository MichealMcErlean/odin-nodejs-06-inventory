const pool = require('./pool');

async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers;');
  return rows;
}

async function getAllPublishers() {
  const { rows } = await pool.query('SELECT * FROM publishers;')
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres;');
  return rows;
}

async function getAllPlatforms() {
  const {rows} = await pool.query('SELECT * FROM platforms;');
  return rows;
}

module.exports = {
  getAllDevelopers,
  getAllPublishers,
  getAllGenres,
  getAllPlatforms,
}