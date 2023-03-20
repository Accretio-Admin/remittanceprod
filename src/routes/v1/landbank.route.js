const express = require('express');
const validate = require('../../middlewares/validate');
// const userLimitValidation = require('../../validations/userlimitations.validation');
const { credentialController, landbankController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const agentLimitation = require('../../middlewares/lb-limitations');
const router = express.Router();

router
    .route('/credentials/')
    .post(auth('manageLandbankCredentials'),credentialController.addCredential)
    .get(credentialController.getCredentials)
router
    .route('/credentials/:credentialId')
    .delete(auth('manageLandbankCredentials'), credentialController.removeCredentials)
    .post(auth('manageLandbankCredentials'), credentialController.assignCredential)
    .patch(auth('manageLandbankCredentials'), credentialController.unassignCredential)
    .get(auth('manageLandbankCredentials'), credentialController.getCredentialAssignmentsByCredentialId);
router
    .route('/credentials/:credentialId/:userId')
    .get(credentialController.getUserAssignmentByCredentialId);
router
    .route('/transactions/')
    .get(landbankController.getTransactions);
router
    .route('/account/inquiry')
    .post(landbankController.accountInquiry)
router
    .route('/account/inquiry/:txId')
    .post(landbankController.getTxDetails)
router
    .route('/account/remittance')
    .post(agentLimitation.checkIfUserLimited, landbankController.remit)

module.exports = router;