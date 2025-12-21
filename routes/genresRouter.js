const {Router} = require('express');
const genresController = require('../controllers/genresController');
const genresRouter = Router();

genresRouter.get('/:genre_id', genresController.genreDetails)
genresRouter.get('/', genresController.genreList);

module.exports = genresRouter;