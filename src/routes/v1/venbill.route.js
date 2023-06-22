const express = require('express');
const router = express.Router();
const venbillController = require('../../controllers/venbill.controller');

router.post('/balance', venbillController.balanceController);
router.post('/pulldata', venbillController.pulldataController);
router.post('/validate', venbillController.validateController);
router.post('/process', venbillController.processController);
router.post('/inquiry', venbillController.inquiryController);
router.post('/receipt', venbillController.receiptController);

module.exports = router;