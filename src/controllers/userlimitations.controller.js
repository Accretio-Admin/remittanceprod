const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userLimitationsService } = require('../services');
const pick = require('../utils/pick');
const ObjectId = require('mongoose/lib/types/objectid');

const addLimitation = catchAsync(async (req, res) => {
    const newLimitation = await userLimitationsService.createLimitation(req.body);
    res.status(httpStatus.CREATED).send(newLimitation);
});
const getLimitations = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
    const result = await userLimitationsService.queryUserLimitations(filter, options);
    res.send(result);
});
const getLimitsById = catchAsync(async (req, res) => {
    const limit = await userLimitationsService.getLimitsById(req.params.limitId);
    if (!limit) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Limit not found');
    }
    res.send(limit);
});
const editLimitation = catchAsync(async (req, res) => {
    const limit = await userLimitationsService.editLimitationById(req.params.limitId, req.body);
    res.send(limit);
});
const deleteLimitation = catchAsync(async (req, res) => {
    const limit = await userLimitationsService.deleteLimitation(req.params.limitId, req.body);
    res.send(limit);
});
const getBulkLimitsById = catchAsync(async (req, res) => {
    const bulkIds = req.params.userIds.split(',');

    // Convert user IDs to ObjectIds, but use the $expr operator in the filter
    const query = bulkIds.map(e => ObjectId(`${e}`));

    const filter = { $expr: { $and: [{ $in: ["$userId", query] }, { $eq: ["$deleted", false] }] }};
    const limits = await userLimitationsService.getBulkLimitsById(filter);
    res.send(limits);
});

module.exports = {
    addLimitation,
    getLimitations,
    getLimitsById,
    editLimitation,
    deleteLimitation,
    getBulkLimitsById
};
