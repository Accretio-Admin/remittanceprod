const express = require('express');
const { bayadcenterController } = require('../../controllers');
const router = express.Router();

router
    .route('/billers')
    .get(bayadcenterController.getBillers);

router
    .route('/billers/:billerId')
    .get(bayadcenterController.getBiller);

router
    .route('/billers/:billerId/fees')
    .get(bayadcenterController.getBillerFees);

router
    .route('/billers/:billerId/accounts/:accountId')
    .get(bayadcenterController.getBillerAccount);

router
    .route('/billers/:billerId/payments')
    .post(bayadcenterController.createBillerPayment);

router
    .route('/billers/:billerId/payments/:paymentId')
    .get(bayadcenterController.getBillerPayment);

router
    .route('/wallets')
    .get(bayadcenterController.getWallets);

module.exports = router;
