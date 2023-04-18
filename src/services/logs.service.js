const httpStatus = require('http-status');
const Logs = require('../models/logs.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment-timezone');

const createLogs = async (ip) => {
    const dateManila = moment.tz(Date.now(), "Asia/Manila");
    const initLog = {
        ip: ip,
        enterTime: dateManila.format(),
        enterDate: dateManila.format(),
        exitTime: dateManila.format(),
        exitDate: dateManila.format()
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
    getLogs,
    getLogById
};
