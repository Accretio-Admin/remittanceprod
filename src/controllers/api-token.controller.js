const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { apiToken, tokenService, userService } = require('../services');
const pick = require('../utils/pick');
const { tokenTypes } = require('../config/tokens');

const createToken = catchAsync(async (req, res) => {
    // createApiToken
    const {referrerId, userId, endpointGroupId} = req.body;
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
    const {name, endpoints} = req.body;
    const revampedData = {
        name: name,
        endpoints: endpoints,
    }
    const tokenResponse = await apiToken.createGroupApiEndpoints(revampedData);
    res.send(tokenResponse);
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

module.exports = {
    createToken,
    createGroupApiEndpoints,
    regenerateToken,
    getTokenByUserId,
    editApiToken,
    getGroupApiEndpoints
};
