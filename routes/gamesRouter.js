const {Router} = require('express');
const gamesController = require('../controllers/gamesController.js')
const gamesRouter = Router();

gamesRouter.post('/update/:game_id/proceed', gamesController.gameUpdateAction)
gamesRouter.get('/update/:game_id', gamesController.gameUpdatePage)
gamesRouter.post('/add/proceed', gamesController.gameAddAction);
gamesRouter.get('/add', gamesController.gameAddPage);
gamesRouter.get('/:game_id', gamesController.showGame);
gamesRouter.get('/', gamesController.showGameList);


module.exports = gamesRouter;