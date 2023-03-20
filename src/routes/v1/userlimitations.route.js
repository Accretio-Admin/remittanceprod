const express = require('express');
const validate = require('../../middlewares/validate');
const userLimitValidation = require('../../validations/userlimitations.validation');
const { userLimitationsController } = require('../../controllers');

const router = express.Router();

router
    .route('/')
    .post(validate(userLimitValidation.addLimitation), userLimitationsController.addLimitation)
    .get(userLimitationsController.getLimitations);
router
    .route('/:limitId')
    .get(userLimitationsController.getLimitsById)
    .patch(userLimitationsController.editLimitation)
    .delete(userLimitationsController.deleteLimitation);

module.exports = router;