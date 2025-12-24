const {Router} = require('express');
const browseController = require('../controllers/browseController')
const browseRouter = Router();

browseRouter.post('/:categoryType/delete/:id', browseController.deleteItem)
browseRouter.post('/:categoryType/update/:id/proceed', browseController.updateAction);
browseRouter.get('/:categoryType/update/:id', browseController.updatePage);
browseRouter.post("/:categoryType/add/proceed", browseController.addItemAction);
browseRouter.get('/:categoryType/add', browseController.addItemPage);
browseRouter.get('/:categoryType/:id', browseController.showSingle);
browseRouter.get('/:categoryType', browseController.showList);

module.exports = browseRouter;