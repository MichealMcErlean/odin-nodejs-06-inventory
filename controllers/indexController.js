const db = require('../db/queries.js')
const {
  body,
  query,
  validationResult,
  matchedData
} = require('express-validator');

console.log('Controller file loaded');

exports.showMainSearch = async (req, res, next) => {
  const developers = await db.getAllDevelopers();
  const publishers = await db.getAllPublishers();
  const genres = await db.getAllGenres();
  const platforms = await db.getAllPlatforms();
  res.render('index', {
    title: 'Game Search',
    developers: developers,
    publishers: publishers,
    genres: genres,
    platforms: platforms,
  })
}

const validateGameSearch = [
  query('name').trim().optional({checkFalsy: true})
    .isLength({min: 0, max: 60}).withMessage('Name must be less than 60 characters'),
  query('developer').optional({checkFalsy: true})
    .isInt().withMessage('Somehow managed to not pass an integer from a selectbox'),
  query('publisher').optional({checkFalsy: true})
    .isInt().withMessage('Somehow managed to not pass an integer from a selectbox'),
  query('genre').optional({checkFalsy: true})
    .isInt().withMessage('Somehow managed to not pass an integer from a selectbox'),
  query('platform').optional({checkFalsy: true})
    .isInt().withMessage('Somehow managed to not pass an integer from a selectbox')
]

exports.searchGames = [
  validateGameSearch,
  async (req, res, next) => {
    console.log('Request received at searchGames');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errors detected');
      return res.status(400).render('index', {
        title: 'Game Search',
        errors: errors.array(),
      });
    }
    const {name, developer, publisher, genre, platform} = matchedData(req, {includeOptionals: true});
    const params = [name, developer, publisher, genre, platform];
    console.log(params);
    try {
      const searchResults = await db.searchForGames(params);
      res.render('searchResults', {
        title: 'Search Results',
        searchResults: searchResults
      });
    } catch(err) {
      console.error("Controller Error:", err);
      res.status(500).send('Internal Server Error');
    }
  }
]