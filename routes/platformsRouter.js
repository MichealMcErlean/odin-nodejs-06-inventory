const {Router} = require('express');
const platformsController = require('../controllers/platformsController.js')
const platformsRouter = Router();

// platformsRouter.post('/delete/:platform_id', platformsController.platformDelete)
platformsRouter.post('/update/:platform_id/proceed', platformsController.platformUpdateAction)
platformsRouter.get('/update/:platform_id', platformsController.platformUpdatePage)
platformsRouter.post('/add/proceed', platformsController.platformAddAction)
platformsRouter.get('/add', platformsController.platformAddPage)
platformsRouter.get('/:platform_id', platformsController.platformDetails)
platformsRouter.get('/', platformsController.platformsList)

module.exports = platformsRouter;