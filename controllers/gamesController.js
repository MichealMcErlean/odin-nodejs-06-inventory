const { response } = require('express');
const db=require('../db/queries.js');
const {
  body,
  validationResult,
  matchedData
} = require('express-validator');

exports.showGameList = async (req, res, next) => {
  console.log('Reached controller')
  const games = await db.getAllGames();
  console.log(games);
  res.render('games', {
    title: 'Games',
    games: games
  });
};

exports.showGame = async (req, res, next) => {
  const {game_id} = req.params;
  const game = await db.getGameById(game_id);
  res.render('gameDetails', {
    title: 'Game Details',
    game: game
  });
};

exports.gameAddPage = async (req, res, next) => {
  const developers = await db.getAllDevelopers();
  const publishers = await db.getAllPublishers();
  const platforms = await db.getAllPlatforms();
  const genres = await db.getAllGenres();
  res.render('gameAdd', {
    title: 'Add New Game',
    developers,
    publishers,
    platforms,
    genres
  })
}

const validateGame = [
  body('gameName').trim()
    .isLength({min: 1, max: 60}).withMessage("Name must be between 1 and 60 characters in length."),
  body('gamePrice').trim()
    .notEmpty().withMessage("Must provide a price.")
    .isDecimal({decimal_digits: '2'}).withMessage("Price must be in the format xxx.yy, where x, y are digits."),
  body('gameQuantity').trim()
    .notEmpty().withMessage('Must provide a quantity.')
    .isInt({min: 1, max: 100, allow_leading_zeroes: false}).withMessage("Quantity must be between 1 and 100."),
  body('gameReleaseDate').trim()
    .notEmpty().withMessage('Must provide a release date.')
    .isISO8601().withMessage('Date must be in a valid format (YYYY-MM-DD).')
    .toDate(),
  body('gameDeveloper').trim()
    .notEmpty().withMessage('Must choose a developer.')
    .isInt({min: 1, allow_leading_zeroes: false}).withMessage('Developer ID must be a positive integer.'),
  body('gamePublisher').trim()
    .notEmpty().withMessage('Must choose a publisher.')
    .isInt({min: 1, allow_leading_zeroes: false}).withMessage('Publisher ID must be a positive integer.'),
  body('gamePlatforms')
    .toArray()
    .customSanitizer(values => values.filter(val => val.trim() !== ''))
    .isArray({min: 1}).withMessage('Choose at least 1 platform.'),
  body('gameGenres')
    .toArray()
    .customSanitizer(values => values.filter(val => val.trim() !== ''))
    .isArray({min: 1}).withMessage('Choose at least 1 genre.')
]

exports.gameAddAction = [
  validateGame,
  async (req, res, next) => {
    const errors = validationResult(req).errors;
    if (errors.length != 0) {
      console.log('Errors detected');
      const developers = await db.getAllDevelopers();
      const publishers = await db.getAllPublishers();
      const platforms = await db.getAllPlatforms();
      const genres = await db.getAllGenres();
      return res.status(400).render('gameAdd', {
        title: 'New Publisher',
        errors: errors,
        developers,
        publishers,
        platforms,
        genres
      })
    }
    try {
      await db.gameAdd(matchedData(req));
      res.redirect('/games');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }
  }
]

const validateUpdateGame = [
  body('newName').trim()
    .isLength({min: 1, max: 60}).withMessage("Name must be between 1 and 60 characters in length."),
  body('newPrice').trim()
    .notEmpty().withMessage("Must provide a price.")
    .isDecimal({decimal_digits: '2'}).withMessage("Price must be in the format xxx.yy, where x, y are digits."),
  body('newQuantity').trim()
    .notEmpty().withMessage('Must provide a quantity.')
    .isInt({min: 1, max: 100, allow_leading_zeroes: false}).withMessage("Quantity must be between 1 and 100."),
  body('newReleaseDate').trim()
    .notEmpty().withMessage('Must provide a release date.')
    .isISO8601().withMessage('Date must be in a valid format (YYYY-MM-DD).')
    .toDate(),
  body('newDeveloper').trim()
    .notEmpty().withMessage('Must choose a developer.')
    .isInt({min: 1, allow_leading_zeroes: false}).withMessage('Developer ID must be a positive integer.'),
  body('newPublisher').trim()
    .notEmpty().withMessage('Must choose a publisher.')
    .isInt({min: 1, allow_leading_zeroes: false}).withMessage('Publisher ID must be a positive integer.'),
  body('newPlatforms')
    .toArray()
    .customSanitizer(values => values.filter(val => val.trim() !== ''))
    .isArray({min: 1}).withMessage('Choose at least 1 platform.'),
  body('newGenres')
    .toArray()
    .customSanitizer(values => values.filter(val => val.trim() !== ''))
    .isArray({min: 1}).withMessage('Choose at least 1 genre.')
]

exports.gameUpdatePage = async (req, res, next) => {
  const {game_id} = req.params;

  const game = await db.getGameViewById(game_id);
  const developers = await db.getAllDevelopers();
  const publishers = await db.getAllPublishers();
  const platforms = await db.getAllPlatforms();
  const genres = await db.getAllGenres();

  if (game[0].release_date instanceof Date) {
    const release_date_formatted = game[0].release_date.toLocaleDateString('en-CA');
    game[0].release_date = release_date_formatted;
  }

  res.render('gameUpdate', {
    title: 'Update Game Info',
    game,
    developers,
    publishers,
    platforms,
    genres
  })
}

exports.gameUpdateAction = [
  validateUpdateGame,
  async (req, res, next) => {
    const errors = validationResult(req).errors;
    const {game_id} = req.params;
    if (errors.length != 0) {
      console.log('Errors detected');
      const {game_id} = req.params;
      const game = await db.getGameViewById(game_id)
      const developers = await db.getAllDevelopers();
      const publishers = await db.getAllPublishers();
      const platforms = await db.getAllPlatforms();
      const genres = await db.getAllGenres();
      return res.status(400).render('gameAdd', {
        title: 'New Publisher',
        errors: errors,
        game,
        developers,
        publishers,
        platforms,
        genres
      })
    }
    try {
      await db.gameUpdate(game_id, matchedData(req));
      res.redirect('/games');
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error')
    }
  }
]