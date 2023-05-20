const express = require('express');
const { ubxController } = require('../../controllers');
const router = express.Router();
const agentLimitation = require('../../middlewares/lb-limitations');
router
    .route('/instapay/banks')
    .get(agentLimitation.checkIfUserLimited, ubxController.getBankInstapay);

router
    .route('/instapay/purpose')
    .get(agentLimitation.checkIfUserLimited, ubxController.getPurposeInstapay);

router
    .route('/instapay/validate')
    .post(agentLimitation.checkIfUserLimited, ubxController.postValidateInstapay);

router
    .route('/instapay/process')
    .post(agentLimitation.checkIfUserLimited, ubxController.postProcessInstapay);

router
    .route('/pesonet/banks')
    .get(agentLimitation.checkIfUserLimited, ubxController.getBankPesonet);

router
    .route('/pesonet/purpose')
    .get(agentLimitation.checkIfUserLimited, ubxController.getPurposePesonet);

router
    .route('/pesonet/validate')
    .post(agentLimitation.checkIfUserLimited, ubxController.postValidatePesonet);

router
    .route('/pesonet/process')
    .post(agentLimitation.checkIfUserLimited, ubxController.postProcessPesonet);

router
    .route('/checkStatus/transaction/:transactionNumber')
    .get(agentLimitation.checkIfUserLimited, ubxController.checkStatusBank);

router
    .route('/paybills/billers')
    .get(agentLimitation.checkIfUserLimited, ubxController.getBillers);

router
    .route('/paybills/billers/:billerCode')
    .get(agentLimitation.checkIfUserLimited, ubxController.getBillerRef);

router
    .route('/paybills/validate')
    .post(agentLimitation.checkIfUserLimited, ubxController.postValidateBiller);

router
    .route('/paybills/process/:transactionNumber')
    .post(agentLimitation.checkIfUserLimited, ubxController.postProcessBiller);

router
    .route('/paybills/checkStatus')
    .get(agentLimitation.checkIfUserLimited, ubxController.checkStatusBiller);

module.exports = router;