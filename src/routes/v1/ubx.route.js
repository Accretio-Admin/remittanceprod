const express = require('express');
const router = express.Router();
const ubxController = require('../../controllers/ubx.controller');

router.get('/instapay/banks', ubxController.getBankInstapay);
router.get('/instapay/purpose', ubxController.getPurposeInstapay);
router.post('/instapay/validate', ubxController.postValidateInstapay);
router.post('/instapay/process', ubxController.postProcessInstapay);
router.get('/pesonet/banks', ubxController.getBankPesonet);
router.get('/pesonet/purpose', ubxController.getPurposePesonet);
router.post('/pesonet/validate', ubxController.postValidatePesonet);
router.post('/pesonet/process', ubxController.postProcessPesonet);
router.get('/checkStatus/transaction/:transactionNumber', ubxController.checkStatusBank);
router.get('/paybills/billers', ubxController.getBillers);
router.get('/paybills/billers/:billerCode', ubxController.getBillerRef);
router.post('/paybills/validate', ubxController.postValidateBiller);
router.post('/paybills/process/:transactionNumber', ubxController.postProcessBiller);
router.get('/paybills/checkStatus', ubxController.checkStatusBiller);

module.exports = router;