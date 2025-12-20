const { Router } = require('express');
const indexController = require('../controllers/indexController.js')
const indexRouter = Router();

indexRouter.get('/', indexController.showMainSearch);
indexRouter.get('/search', indexController.searchGames);

module.exports = indexRouter;