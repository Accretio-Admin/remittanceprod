const express = require('express');
const { credentialController, landbankController, apiTokenController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();

router
    .route('/endpoints')
    .get(apiTokenController.getActiveEndpoints);
router
    .route('/endpoints/group')
    .post(apiTokenController.createGroupApiEndpoints)
    .get(apiTokenController.getGroupApiEndpoints);
router
    .route('/endpoints/group/:groupId')
    .put(apiTokenController.editGroupApiEndpoints)
    .delete(apiTokenController.deleteGroupApiEndpoint);
router
    .route('/code')
    .post(apiTokenController.createToken)
router
    .route('/code/:userId')
    .get(apiTokenController.getTokenByUserId)

router
    .route('/code/:code')
    .patch(apiTokenController.regenerateToken)
    .put(apiTokenController.editApiToken);

module.exports = router;