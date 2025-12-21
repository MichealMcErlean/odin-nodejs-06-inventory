const {Router} = require('express');
const genresController = require('../controllers/genresController');
const genresRouter = Router();

genresRouter.post('/update/:genre_id/proceed', genresController.genreUpdateGenre)
genresRouter.get('/update/:genre_id', genresController.genreUpdatePage);
genresRouter.get('/:genre_id', genresController.genreDetails)
genresRouter.get('/', genresController.genreList);

module.exports = genresRouter;