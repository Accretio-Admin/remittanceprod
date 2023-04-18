const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { apiToken, tokenService, userService } = require('../services');
const pick = require('../utils/pick');
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');
const { activeEndpoints } = require('../config/roles');

const createToken = catchAsync(async (req, res) => {
    // createApiToken
    const { referrerId, userId, endpointGroupId } = req.body;
    const groupId = await apiToken.getGroupIdByName();
    const revampedData = {
        referrerId: referrerId,
        userId: userId,
        endpointGroupId: groupId[0].id
    }
    const tokenResponse = await apiToken.createApiToken(revampedData);
    res.send(tokenResponse);
});
const getTokenByUserId = catchAsync(async (req, res) => {
    const tokens = await apiToken.getTokenByUserId(req.params.userId);
    res.send(tokens);
});
const createGroupApiEndpoints = catchAsync(async (req, res) => {
    // createApiToken
    const { name, endpoints } = req.body;
    const revampedData = {
        name: name,
        endpoints: endpoints,
    }
    try {
        const tokenResponse = await apiToken.createGroupApiEndpoints(revampedData);
        res.send(tokenResponse);
    } catch (error) {
        if (error.code === 11000) { // duplicate key error
            throw new ApiError(httpStatus.BAD_REQUEST, 'This name has been used before, Please use a unique name.');
        } else {
            res.send("Internal Server Error");
        }
    }
});
const editGroupApiEndpoints = catchAsync(async (req, res) => {
    const apiGroupResponse = await apiToken.editApiGroupById(req.params.groupId, req.body);
    res.send(apiGroupResponse);
});
const deleteGroupApiEndpoint = catchAsync(async (req, res) => {
    const apiGroupResponse = await apiToken.deleteApiGroup(req.params.groupId);
    res.send(apiGroupResponse);
});
const getGroupApiEndpoints = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
    const result = await apiToken.getGroupApiEndpoints(filter, options);
    res.send(result);
});
const regenerateToken = catchAsync(async (req, res) => {
    const tokenResponse = await apiToken.regenrateTokenStringById(req.params.code);
    res.send(tokenResponse);
});
const editApiToken = catchAsync(async (req, res) => {
    const tokenResponse = await apiToken.editTokenById(req.params.code, req.body);
    res.send(tokenResponse);
});
const getActiveEndpoints = catchAsync(async (req, res) => {
    const endpoints = activeEndpoints;
    res.send(endpoints);
});

module.exports = {
    createToken,
    createGroupApiEndpoints,
    regenerateToken,
    getTokenByUserId,
    editApiToken,
    getGroupApiEndpoints,
    editGroupApiEndpoints,
    deleteGroupApiEndpoint,
    getActiveEndpoints
};
