const express = require('express');
const { logsController } = require('../../controllers');
const { logsService } = require('../../services');

const router = express.Router();

router
  .route('/')
  .post(logsController.addLogs)
  .get(logsController.getLogs)
router
  .route('/:logId')
  .put(logsController.editLogs)
  .get(logsController.getLogByLogId)
module.exports = router;