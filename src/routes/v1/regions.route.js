const express = require('express');
const validate = require('../../middlewares/validate');
// const userLimitValidation = require('../../validations/userlimitations.validation');
const { regionsController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(regionsController.addRegion)
    .get(regionsController.getRegions)
router
    .route('/:regionId')
    .delete(regionsController.removeRegion);

module.exports = router;