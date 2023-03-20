const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, userLimitationsService, tokenService, emailService, accessLevelService } = require('../services');
const { accessLevel } = require('../config/roles');
const { tokenTypes } = require('../config/tokens');
const ObjectId = require('mongoose/lib/types/objectid');

const createUser = catchAsync(async (req, res) => {
  const tokenDoc = await tokenService.verifyToken(req.headers.authorization.replace('Bearer ', ''), tokenTypes.ACCESS);
  const userByToken = await userService.getUserById(tokenDoc.user);
  const canCreate = accessLevel[userByToken.role].map((e)=> e.role);
  const ip = req.ip;

  let newUser = req.body;
  newUser.referrer = userByToken.id;
  const user = await userService.createUser(canCreate, req.body, ip);
  const accessLevels = await accessLevelService.assignAccessLevelToUserByUser(user);
  user.accessLevels = accessLevels.id;
  user.save();
  if(accessLevels){
    const creds = {
      username: req.body.email,
      password: req.body.password,
    }
    emailService.emailUsernameAndPassword(creds, creds.username);
    res.status(httpStatus.CREATED).send(user);
  }
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
  const tokenDoc = await tokenService.verifyToken(req.headers.authorization.replace('Bearer ', ''), tokenTypes.ACCESS);
  const user = await userService.getUserById(tokenDoc.user);
  const fetchLevel = accessLevel[user.role];
  filter = {$or: fetchLevel};

  if(user.role == 'companyadmin'){
    filter.referrer = ObjectId(user.id);
  }
  let result = await userService.queryUsers(filter, options);
  if(options.page <= 1){
    let addingMe = result.results.reverse();
    addingMe.push(user);
    addingMe.reverse();
    result.results = addingMe;
  }
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
const getUserLimits = catchAsync(async (req, res) => {
  let filter = { userId: req.params.userId, limitType: 'ip', deleted: false }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter']);
  const limits = await userLimitationsService.getUserLimitsById(filter, options);
  if (!limits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No limits found');
  }
  res.send(limits);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const tokenDoc = await tokenService.verifyToken(req.headers.authorization.replace('Bearer ', ''), tokenTypes.ACCESS);
  const userByToken = await userService.getUserById(tokenDoc.user);
  const userToDelete = await userService.getUserById(req.params.userId);
  const canDelete = accessLevel[userByToken.role].map((e)=> e.role);
  await userService.deleteUserById(canDelete, userToDelete.role, req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserLimits
};
