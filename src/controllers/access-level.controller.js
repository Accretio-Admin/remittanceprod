// const httpStatus = require('http-status');
// const catchAsync = require('../utils/catchAsync');
// const { accessLevelService } = require('../services');
// const pick = require('../utils/pick');

// const addAccessLevelToUser = catchAsync(async (req, res) => {
//     const assignNewAccessLevel = await accessLevelService.addAccessLevelToUser(req.body);
//     res.status(httpStatus.CREATED).send(newRegion);
// });
// // const getAccessLevelByRole = catchAsync(async (req, res) => {
// //     const result = await regionsService.getAccessLevelByRole(role);
// //     res.send(result);
// // });
// // const editRegion = catchAsync(async (req, res) => {
// //     const region = await regionsService.editRegionsById(req.params.regionId, req.body);
// //     res.send(region);
// // });
// // const removeRegion = catchAsync(async (req, res) => {
// //     const region = await regionsService.deleteRegion(req.params.regionId, req.body);
// //     res.send(region);
// // });
// module.exports = {
//     addAccessLevelToUser,
//     getAccesslevels
// };
