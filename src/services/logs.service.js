const httpStatus = require('http-status');
const Logs = require('../models/logs.model');
const ApiError = require('../utils/ApiError');


const createLogs = async (ip) => {
    const initLog = {
        ip: ip
    }
    const newLog = await Logs.create(initLog);
    return newLog;
};
const updateLogById = async (logId, updateBody) => {
    const log = await getLogById(logId);
    if (!log) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Log not found');
    }
    Object.assign(log, updateBody);
    await log.save();
    return log;
};
const getLogById = async (logId) => {
    return await Logs.findById(logId);
}
const getLogs = async (filter, options) => {
    const logs = await Logs.paginate(filter, options);
    return logs;
}

module.exports = {
    createLogs,
    updateLogById,
    getLogs
};
