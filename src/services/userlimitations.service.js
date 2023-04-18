const httpStatus = require('http-status');
const { UserLimitations } = require('../models');
const ApiError = require('../utils/ApiError');


const createLimitation = async (userBody) => {
    return UserLimitations.create(userBody);
};
const queryUserLimitations = async (filter, options) => {
    const users = await UserLimitations.paginate(filter, options);
    return users;
};
const getUserLimitsById = async (filter, options) => {
    return UserLimitations.paginate(filter, options);
};
const getUserLimits = async (id, type = 'ip') => {
    return UserLimitations.find({ userId: id, limitType: type, deleted: false });
};
const getLimitsById = async (id) => {
    return UserLimitations.findById(id);
};
const editLimitationById = async (limitId, updateBody) => {
    const limit = await getLimitsById(limitId);
    if (!limit) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Limitation not found');
    }
    Object.assign(limit, updateBody);
    await limit.save();
    return limit;
};
const deleteLimitation = async (limitId) => {
    const remove = {deleted: true};
    return await editLimitationById(limitId, remove);
};
const getBulkLimitsById = async (limitIds) => {
    console.log(limitIds);
    console.log(await UserLimitations.find(limitIds))
    return await UserLimitations.find(limitIds);
};
module.exports = {
    createLimitation,
    queryUserLimitations,
    getLimitsById,
    getUserLimitsById,
    editLimitationById,
    deleteLimitation,
    getUserLimits,
    getBulkLimitsById
};
