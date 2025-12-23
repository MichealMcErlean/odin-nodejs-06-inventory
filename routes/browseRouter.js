const {Router} = require('express');
const browseController = require('../controllers/browseController')
const browseRouter = Router();

// browseRouter.get('/:categoryType/add', browseController.addItem)
browseRouter.get('/:categoryType/:id', browseController.showSingle)
browseRouter.get('/:categoryType', browseController.showList);

module.exports = browseRouter;