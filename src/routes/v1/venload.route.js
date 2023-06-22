const express = require('express');
const router = express.Router();
const venloadController = require('../../controllers/venload.controller');

router.post('/balance', venloadController.postBalance);
router.post('/product-list', venloadController.postProductList);
router.post('/prefix-list', venloadController.postPrefixList);
router.post('/telco-status', venloadController.postTelcoStatus);
router.post('/topup-request', venloadController.postTopupRequest);
router.post('/topup-inquiry', venloadController.postTopupInquiry);
router.post('/epin-request', venloadController.postEpinRequest);
router.post('/epin-inquiry', venloadController.postEpinInquiry);
router.post('/other-request', venloadController.postOtherRequest);
router.post('/other-inquiry', venloadController.postOtherInquiry);
router.post('/transport-request', venloadController.postTransportRequest);
router.post('/transport-inquiry', venloadController.postTransportInquiry);

module.exports = router;