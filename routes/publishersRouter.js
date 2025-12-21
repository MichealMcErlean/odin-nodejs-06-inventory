const {Router} = require('express');
const pubsController = require('../controllers/publishersController');
const publishersRouter = Router();

publishersRouter.post('/delete/:publisher_id', pubsController.pubDelete)
publishersRouter.post('/update/:publisher_id/proceed', pubsController.pubUpdatePub);
publishersRouter.get('/update/:publisher_id', pubsController.pubUpdatePage)
publishersRouter.post('/add/proceed', pubsController.pubAddPubAction)
publishersRouter.get('/add', pubsController.pubAddPubForm)
publishersRouter.get('/:publisher_id', pubsController.pubGetDetails)
publishersRouter.get('/', pubsController.pubList);

module.exports = publishersRouter;