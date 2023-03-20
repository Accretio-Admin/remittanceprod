const express = require('express');
const { credentialController, landbankController, apiTokenController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();

router
    .route('/endpoints')
    .post(apiTokenController.createGroupApiEndpoints)
    .get(apiTokenController.getGroupApiEndpoints);
router
    .route('/code')
    .post(apiTokenController.createToken)
    // .get(apiTokenController.getTokenByUserId)
router
    .route('/code/:userId')
    .get(apiTokenController.getTokenByUserId)

router
    .route('/code/:code')
    .patch(apiTokenController.regenerateToken)
    .put(apiTokenController.editApiToken);

module.exports = router;