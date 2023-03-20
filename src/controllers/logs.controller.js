const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { regionsService, logsService } = require('../services');
const pick = require('../utils/pick');

const addLogs = catchAsync(async (req, res) => {
    const newLog = await logsService.createLogs(req.ip)
    res.status(httpStatus.CREATED).send(newLog);
});
const editLogs = catchAsync(async (req, res) => {
    const editLog = await logsService.updateLogById(req.params.logId, req.body)
    res.send(editLog);
});
const getLogs = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
    const result = await logsService.getLogs(filter, options);
    res.send(result);
});
module.exports = {
    addLogs,
    editLogs,
    getLogs
};
