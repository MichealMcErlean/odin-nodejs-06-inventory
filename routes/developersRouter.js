const { Router } = require('express');
const devsController = require('../controllers/developersController');
const developersRouter = Router();

developersRouter.post('/update/:developer_id/proceed', devsController.performUpdateDev);
developersRouter.get('/update/:developer_id', devsController.updateDev);
developersRouter.get('/:developer_id', devsController.showDevById);
developersRouter.get('/', devsController.showAllDevs);



module.exports = developersRouter;