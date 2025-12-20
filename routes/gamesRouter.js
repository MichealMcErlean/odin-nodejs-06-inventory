const {Router} = require('express');
const gamesController = require('../controllers/gamesController.js')
const gamesRouter = Router();

gamesRouter.get('/', gamesController.showGameList);
gamesRouter.get('/:game_id', gamesController.showGame);

module.exports = gamesRouter;