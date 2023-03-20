const catchAsync = require('../utils/catchAsync');
const { configService } = require('../services');

const getConfig = catchAsync(async (req, res) => {
    const config = await configService.getConfig();
    res.send(config);
});
const addConfig = catchAsync(async (req, res) => {
    const config = await configService.addConfig(req.body);
    res.send(config);
});
const getConfigsById = catchAsync(async (req, res) => {
    const config = await configService.getConfigsById(req.params.configId);
    res.send(config);
});
const editConfigById = catchAsync(async (req, res) => {
    const config = await configService.editConfigById(req.params.configId, req.body);
    res.send(config);
});
module.exports = {
    getConfig,
    getConfigsById,
    editConfigById,
    addConfig
};
