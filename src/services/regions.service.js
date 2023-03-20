const httpStatus = require('http-status');
const { GreenRegions } = require('../models');
const ApiError = require('../utils/ApiError');


const createRegion = async (userBody) => {
    console.log('createRegion: ',JSON.stringify(userBody));
    if (await isRegionTaken(userBody.countryCode)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Region already available.');
    }
    // Make sure country code is in lowercase.
    userBody.countryCode = userBody.countryCode.toLowerCase();
    return GreenRegions.create(userBody);
};
const queryRegions = async (filter, options) => {
    const regions = await GreenRegions.paginate(filter, options);
    return regions;
};
const getRegionsById = async (id) => {
    return GreenRegions.findById(id);
};
const isRegionTaken = async (code) => {
    return GreenRegions.findOne({countryCode: code, deleted: false});
};
const editRegionById = async (regionId, updateBody) => {
    const region = await getRegionsById(regionId);
    if (!region) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
    }
    Object.assign(region, updateBody);
    await region.save();
    return region;
};
const deleteRegion = async (regionId) => {
    const remove = { deleted: true };
    return await editRegionById(regionId, remove);
};
const deleteAllRegions = async () => {
    return GreenRegions.remove();
};
module.exports = {
    createRegion,
    queryRegions,
    editRegionById,
    deleteRegion,
    deleteAllRegions

};
