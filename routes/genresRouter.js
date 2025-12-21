const {Router} = require('express');
const genresController = require('../controllers/genresController');
const genresRouter = Router();

genresRouter.post('/delete/:genre_id', genresController.genreDelete);
genresRouter.post('/update/:genre_id/proceed', genresController.genreUpdateGenre)
genresRouter.get('/update/:genre_id', genresController.genreUpdatePage);
genresRouter.post('/add/proceed', genresController.genreAddAction);
genresRouter.get('/add', genresController.genreAddPage);
genresRouter.get('/:genre_id', genresController.genreDetails)
genresRouter.get('/', genresController.genreList);

module.exports = genresRouter;