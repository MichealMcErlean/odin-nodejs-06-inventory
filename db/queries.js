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

async function searchForGames(params) {
  
  const [name, developer, publisher, genre, platform] = params;

  const conditions = [];
  const values = [];

  if (name) {
    values.push(`%${name}%`);
    conditions.push(`name like $${values.length}`);
  }
  if (developer) {
    values.push(developer);
    conditions.push(`developer_id = $${values.length}`);
  }
  if (publisher) {
    values.push(publisher);
    conditions.push(`publisher_id = $${values.length}`);
  }
  if (genre) {
    values.push(genre);
    conditions.push(`genre_id = $${values.length}`)
  }
  if (platform) {
    values.push(platform);
    conditions.push(`platform_id = $${values.length}`);
  }

  let queryText = 'SELECT game_id, name FROM game_library';

  if (conditions.length > 0) {
    queryText += ` WHERE ${conditions.join(' AND ')}`;
  }

  console.log('Executing SQL:', queryText);
  console.log('With values:', values);

  const { rows } = await pool.query(queryText, values);
  return rows;
}

async function getAllGames() {
  const {rows} = await pool.query('SELECT game_id, name FROM game_library ORDER BY name;')
  return rows;
}

async function getGameById(game_id) {
  const {rows} = await pool.query('SELECT * FROM game_library WHERE game_id = $1;', [game_id]);
  return rows;
}

async function getDevById(developer_id) {
  const { rows } = await pool.query('SELECT * FROM developers WHERE developer_id = $1', [developer_id]);
  return rows;
}

async function updateDevById(developer_id, developer) {
  await pool.query('UPDATE developers SET developer = $1 WHERE developer_id = $2;', [developer, developer_id]);
}

async function addDev({newdevname}) {
  await pool.query('INSERT INTO developers (developer) VALUES ($1);', [newdevname]);
}

async function deleteDev(developer_id) {
  await pool.query('DELETE FROM developers WHERE developer_id = $1;', [developer_id]);
}

async function devGamesByDevId(developer_id) {
  const {rows} = await pool.query('SELECT game_id, name FROM game_library WHERE developer_id = $1;', [developer_id]);
  return rows;
}

module.exports = {
  getAllDevelopers,
  getAllPublishers,
  getAllGenres,
  getAllPlatforms,
  searchForGames,
  getAllGames,
  getGameById,
  getDevById,
  updateDevById,
  addDev,
  deleteDev,
  devGamesByDevId
}