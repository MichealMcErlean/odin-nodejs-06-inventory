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

exports.genreDetails = async (req, res, next) => {
  const {genre_id} = req.params;
  const genre = await db.genreGetById(genre_id);
  const games = await db.genreGetGamesByGenreId(genre_id);
  res.render('genreDetails', {
    title: 'Genre Details',
    genre,
    games
  })
}