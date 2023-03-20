const httpStatus = require("http-status");
const { ApiGroups, Config } = require("../models");
const ApiTokens = require("../models/api-tokens.model");
const ApiError = require("../utils/ApiError");

const addConfig = (config) => {
    return Config.create(config)
}
const getConfig = () => {
    return Config.find({})
}
const getConfigsById = (id) => {
    return Config.findById(id);
}
const editConfigById = async (configId, updateBody) => {
    const config = await getConfigsById(configId);
    if (!config) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
    }
    Object.assign(config, updateBody);
    await config.save();
    return config;
};
module.exports = {
    editConfigById,
    getConfigsById,
    getConfig,
    addConfig
}