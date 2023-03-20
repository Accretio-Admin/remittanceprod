const httpStatus = require('http-status');
const { User, GreenRegions } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require("axios");
const userLimitationsService = require('./userlimitations.service');



const isEmailDisposable = async (email) => {
  return axios
    .get(`https://open.kickbox.com/v1/disposable/adon.naftoli@falltrack.net${email}`)
    .then((disposableResult) => {
      return disposableResult.data.disposable;
    })
    .catch((err) => {
      reject(err);
    });
};
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (canCreate, userBody, ip = '0') => {
  const dbHasUsers = await queryUsers({}, {});
  if (dbHasUsers.totalResults === 0 && userBody.role != 'initialsuperadmin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Initialization required.');
  }
  if(userBody.role && !canCreate.includes(userBody.role)){
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not allowed to do this action. Please contact administrator');
  }
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await userIsOffRegion(ip)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are out of authorized regions whitelisted by administrator');
  }
  if (await isEmailDisposable(userBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can't use disposable emails!`
    );
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options, tokenDoc) => {
  const users = await User.paginate(filter, options);
  return users;
};

const userIsOffRegion = async (ip) => {
  try {
    const ipInfo = await axios.get(`https://api.ip2location.io/?key=7C5384E65E3B5B520A588FB8F9281719&ip=${ip}&format=json`);
    const isWhiteListed = await getRegionsByShortCode(ipInfo.data.country_code.toLowerCase());
    const isIpValid = (isWhiteListed.length>0 || ip == '::1');
    return !isIpValid;

  } catch (error) {
    console.error(error);
  }
};
const isUserLimitedByIp = async (userId, ip, type = 'ip') => {
  try {
    const userAuthorizedTerritory = await userLimitationsService.getUserLimits(userId, type);
    const validIps = userAuthorizedTerritory.map((item) => {return item['value']});
    const exception = validIps.includes('all');
    return exception ? true : validIps.includes(ip);

  } catch (error) {
    console.error(error);
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};
const getRegionsByShortCode = async (code) => {
  return GreenRegions.find({ countryCode: code, deleted: false });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (canDelete, user, userId) => {
  if(!canDelete.includes(user)){
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not allowed to do this action. Please contact administrator');
  }
  const remove = {deleted: true};
  return await updateUserById(userId, remove);
};

module.exports = {
  isEmailDisposable,
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isUserLimitedByIp
};
