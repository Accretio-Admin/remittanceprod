const httpStatus = require('http-status');
const { dashboardAl } = require('../config/roles');
const { AccessLevels } = require('../models');
const ApiError = require('../utils/ApiError');


const assignAccessLevelToUserByUser = async (user) => {
    await deleteAccessLevel(user.id);
    const accessLevel = await getAccessLevelByRole(user.role);
    return AccessLevels.create({user: user.id, accessLevel: accessLevel});
};
// const queryRegions = async (filter, options) => {
//     const regions = await GreenRegions.paginate(filter, options);
//     return regions;
// };
const getAccessLevelByRole = async (role) => {
    const fetchLevel = dashboardAl.get(role);
    return fetchLevel;
};
// const isRegionTaken = async (code) => {
//     return GreenRegions.findOne({countryCode: code, deleted: false});
// };
const editAccessLevelByUserId = async (userId, updateBody) => {
    const edittedAccessLevel = AccessLevels.updateMany({userId: userId}, updateBody)
    return edittedAccessLevel;
};
const deleteAccessLevel = async (userId) => {
    const remove = { deleted: true };
    return await editAccessLevelByUserId(userId, remove);
};
// const deleteAllRegions = async () => {
//     return GreenRegions.remove();
// };
module.exports = {
    assignAccessLevelToUserByUser
};
