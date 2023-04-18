const httpStatus = require("http-status");
const ObjectId = require("mongoose/lib/types/objectid");
const { ApiGroups } = require("../models");
const ApiTokens = require("../models/api-tokens.model");
const ApiError = require("../utils/ApiError");


const createTokenString = () =>{
    return [...Array(70)].map(() => Math.random().toString(36)[2]).join('');
}
const createTokenData = (apiTokenData) => {
    return {
        token: createTokenString(),
        referrer: apiTokenData.referrerId,
        user: apiTokenData.userId,
        expiration: new Date(),
        endpointGroupId: apiTokenData.endpointGroupId
    }
}
const createApiGroupData = (groupData) => {
    return {
        name: groupData.name,
        endpoints: groupData.endpoints,
    }
}
// Create Api Token
const createApiToken = async (apiTokenData) => {
    // if (!apiTokenData.reffererId) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a refferer.');
    // }
    // if (!apiTokenData.userId) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a User Id.');
    // }
    // if (!apiTokenData.endpointGroupId) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a API Group Id.');
    // }
    const tokenData = createTokenData(apiTokenData);
    
    return ApiTokens.create(tokenData);
};
const getToken = async (apikey) => {
    return ApiTokens.findOne({token: apikey}).populate('endpointGroupId');
}
// Get Tokens by id
const getTokenById = async (id) => {
    return ApiTokens.findById(id);
}
// Get Tokens by userid
const getTokenByUserId = async (id) => {
    return ApiTokens.find({user: id});
}
const getGroupIdByName = async () => {
    return ApiGroups.find({name: "daniel"});
}
// Activate Token by admin
// Assign api user to group endpoints
// Extend Expiration
// Change refferer by token
// Change groupID for existing token
const editTokenById = async (tokenId, updateBody) => {
    const token = await getTokenById(tokenId);
    if (!token) {
        throw new ApiError(httpStatus.NOT_FOUND, 'API token not found');
    }
    Object.assign(token, updateBody);
    await token.save();
    return token;
}
// Change token
const regenrateTokenStringById = async (id) => {
    const token = await getTokenById(id);
    if (!token) {
        throw new ApiError(httpStatus.NOT_FOUND, 'API token not found');
    }
    token.token = createTokenString();    
    return await editTokenById(id, token);
}
// Create Group Endpoints
const createGroupApiEndpoints = async (apiGroupData) => {
    const groupData = createApiGroupData(apiGroupData);
    return ApiGroups.create(groupData);
};
const getApiGroupById = async (id) => {
    return ApiGroups.findById(id);
}
const editApiGroupById = async (groupId, updateBody) => {
    const apiGroup = await getApiGroupById(groupId);
    if (!apiGroup) {
        throw new ApiError(httpStatus.NOT_FOUND, 'API group not found');
    }
    const groupIsInUse = await ApiTokens.find({endpointGroupId: ObjectId(groupId)}).count();
    const endpointsInUse = await ApiGroups.findById(groupId);
    if(groupIsInUse > 0 && updateBody.endpoints.length < endpointsInUse.endpoints.length){
        throw new ApiError(httpStatus.NOT_FOUND, 'API group is in use and its endpoints cannot be deleted.');
    }
    Object.assign(apiGroup, updateBody);
    await apiGroup.save();
    return apiGroup;
}
const getGroupApiEndpoints = async (filter, options) => {
    const apiGroups =  await ApiGroups.paginate(filter, options);
    return apiGroups;
};
const deleteApiGroup = async (groupId) => {
    const groupIsInUse = await ApiTokens.find({endpointGroupId: ObjectId(groupId)}).count();
    if(groupIsInUse > 0){
        throw new ApiError(httpStatus.NOT_FOUND, 'API group is in use and cannot be deleted.');
    }
    const remove = { deleted: true };
    return await editApiGroupById(groupId, remove);
};
module.exports = {
    createGroupApiEndpoints,
    createApiToken,
    regenrateTokenStringById,
    getTokenByUserId,
    getToken,
    getGroupIdByName,
    editTokenById,
    getGroupApiEndpoints,
    editApiGroupById,
    deleteApiGroup
}