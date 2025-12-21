const { Router } = require('express');
const devsController = require('../controllers/developersController');
const developersRouter = Router();

developersRouter.post('/delete/:developer_id', devsController.deleteDev)
developersRouter.post('/update/:developer_id/proceed', devsController.performUpdateDev);
developersRouter.get('/update/:developer_id', devsController.updateDev);
developersRouter.post('/add/proceed', devsController.addDevToDB)
developersRouter.get('/add', devsController.addDevPage)
developersRouter.get('/:developer_id', devsController.showDevById);
developersRouter.get('/', devsController.showAllDevs);



module.exports = developersRouter;