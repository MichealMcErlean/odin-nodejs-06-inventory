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
  console.log('genre_id is', genre_id)
  const genre = await db.genreGetById(genre_id);
  const games = await db.genreGetGamesByGenreId(genre_id);
  res.render('genreDetails', {
    title: 'Genre Details',
    genre,
    games
  })
}

exports.genreUpdatePage = async (req, res, next) => {
  const {genre_id} = req.params;
  const genre = await db.genreGetById(genre_id);
  res.render('genreUpdate', {
    title: 'Update Genre',
    genre
  })
}

const validateGenre = [
  body('newgenrename').trim()
    .isLength({min: 1, max: 60}).withMessage('Must be between 1 and 60 characters in length.')
]

exports.genreUpdateGenre = [
  validateGenre,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('genreUpdate', {
        title: 'Update Genre',
        errors: errors
      })
    }
    const {genre_id} = req.params;
    const {newgenrename} = matchedData(req);

    try {
      await db.genreUpdateById(genre_id, newgenrename);
      res.redirect('/genres');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error');
    }
  }
]

exports.genreDelete = async (req, res, next) => {
  console.log('made it to genreDelete controller')
  const {genre_id} = req.params;
  await db.genreDelete(genre_id);
  res.redirect('/genres');
}

exports.genreAddPage = async (req, res, next) => {
  res.render('genreAdd', {
    title: 'Add New Genre'
  })
}

exports.genreAddAction = [
  validateGenre,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('genreAdd', {
        title: 'New Publisher',
        errors: errors
      })
    }
    try {
      await db.genreAdd(matchedData(req));
      res.redirect('/genres');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }
  }
]