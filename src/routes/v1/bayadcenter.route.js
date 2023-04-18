const express = require('express');
const { bayadcenterController } = require('../../controllers');
const router = express.Router();
const agentLimitation = require('../../middlewares/lb-limitations');
router
    .route('/billers')
    .get(agentLimitation.checkIfUserLimited, bayadcenterController.getBillers);

router
    .route('/billers/:billerId')
    .get(bagentLimitation.checkIfUserLimited, ayadcenterController.getBiller);

router
    .route('/billers/:billerId/fees')
    .get(agentLimitation.checkIfUserLimited, bayadcenterController.getBillerFees);

router
    .route('/billers/:billerId/accounts/:accountId')
    .get(agentLimitation.checkIfUserLimited, bayadcenterController.getBillerAccount);

router
    .route('/billers/:billerId/payments')
    .post(agentLimitation.checkIfUserLimited, bayadcenterController.createBillerPayment);

router
    .route('/billers/:billerId/payments/:paymentId')
    .get(agentLimitation.checkIfUserLimited, bayadcenterController.getBillerPayment);

router
    .route('/wallets')
    .get(agentLimitation.checkIfUserLimited, bayadcenterController.getWallets);

module.exports = router;
