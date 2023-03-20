const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { regionsService } = require('../services');
const pick = require('../utils/pick');

const addRegion = catchAsync(async (req, res) => {
    const newRegion = await regionsService.createRegion(req.body);
    res.status(httpStatus.CREATED).send(newRegion);
});
const getRegions = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
    const result = await regionsService.queryRegions(filter, options);
    res.send(result);
});
const editRegion = catchAsync(async (req, res) => {
    const region = await regionsService.editRegionsById(req.params.regionId, req.body);
    res.send(region);
});
const removeRegion = catchAsync(async (req, res) => {
    const region = await regionsService.deleteRegion(req.params.regionId, req.body);
    res.send(region);
});
module.exports = {
    addRegion,
    getRegions,
    editRegion,
    removeRegion
};
