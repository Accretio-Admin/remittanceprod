const express = require('express');
const { configController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth("manageConfig"), configController.addConfig)
  .get(auth("manageConfig"), configController.getConfig);
router
  .route('/:configId')
  .patch(auth("manageConfig"), configController.editConfigById);
module.exports = router;