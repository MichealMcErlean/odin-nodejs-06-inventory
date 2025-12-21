const db = require('../db/queries.js');
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

exports.genreList = async (req, res, next) => {
  const genres = await db.getAllGenres();
  console.log(genres);
  res.render('genres', {
    title: 'Genres',
    genres
  });
}