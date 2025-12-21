const {Router} = require('express');
const pubsController = require('../controllers/publishersController');
const publishersRouter = Router();

publishersRouter.get('/:publisher_id', pubsController.pubGetDetails)
publishersRouter.post('/add/proceed', pubsController.pubAddPubAction)
publishersRouter.get('/add', pubsController.pubAddPubForm)
publishersRouter.get('/', pubsController.pubList);

module.exports = publishersRouter;