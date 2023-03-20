const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const axios = require("axios");
const { authService, userService, tokenService, emailService, userLimitationsService, regionsService, accessLevelService, configService, credentialsService, apiToken } = require('../services');
const { readFileSync } = require('fs');
const { Client } = require('ssh2');
var parseString = require('xml2js').parseString;
const { hardCodeConfig, credentials, groupEndpoints } = require('../config/api-config');
const connectToServer = catchAsync(async (req, res) => {
  let  curl = `curl --location --request POST 'http://222.127.109.64:9080/wstest/ws/cxf/remittance?wsdl' --header 'Content-Type: text/xml' --data-raw ${req.body.data}`
  curl = curl.replace(/&lt;/g,'<');
  curl = curl.replace(/<!--Optional:-->/g,'');
  const conn = new Client();
  conn.on('ready', () => {
    conn.exec(curl, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', (data) => {
        const soap = data;

        // Response deep search function
        const findAllByKey = (obj, keyToFind) => {
          return Object.entries(obj)
            .reduce((acc, [key, value]) => (key === keyToFind)
              ? acc.concat(value)
              : (typeof value === 'object')
              ? acc.concat(findAllByKey(value, keyToFind))
              : acc
            , [])
        }
        parseString(soap, function (err, result) {
          const returnData = findAllByKey(result, 'return')[0];
          res.status(httpStatus.CREATED).send(returnData);
        });
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: '35.213.167.183',
    port: 22,
    username: 'daniel',
    privateKey: readFileSync('./src/config/id_rsa')
  });
});
const register = catchAsync(async (req, res) => {
  const ip = req.ip;
  let host = `${req.get("host")}`;
  const redirectUri = `${req.protocol}://${host}/v1/auth`;
  const createUser = ['companyadmin']
  const user = await userService.createUser(createUser, req.body, ip);
  const tokens = await tokenService.generateAuthTokens(user);
  // Uncomment if email verification is required.
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  // await emailService.sendVerificationEmail(redirectUri, user.email, verifyEmailToken);
  const accessLevels = await accessLevelService.assignAccessLevelToUserByUser(user);
  user.accessLevels = accessLevels.id;
  user.save();
  if(accessLevels){
    res.status(httpStatus.CREATED).send({ user, tokens });
  }
});
const initialSuperAdminRegistration = catchAsync(async (req, res) => {
  const intialCode = req.query.code;
  let host = `${req.get("host")}`;
  const redirectUri = `${req.protocol}://${host}/v1/auth`;
  if (intialCode !== process.env.REGISTRATION_CODE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized app initialization. Please contact app owner.');
  }
  const ip = req.ip;

  // Add super admin region by ip first
  const ipDetails = await getInfoFromIpAddress(ip);
  const countryCode = ipDetails.data.country_code.toLowerCase();
  let regionInfo = {
    countryCode: countryCode,
    flag: `https://flagcdn.com/${countryCode}.svg`,
  }
  console.log('regionInfo: ', JSON.stringify(regionInfo));
  await regionsService.deleteAllRegions();
  await regionsService.createRegion(regionInfo);

  // Change role to super admin second
  req.body.role = 'initialsuperadmin'

  // Allow to create initialsuperadmin
  canCreate = ['initialsuperadmin']
  // Register User fourth
  const user = await userService.createUser(canCreate, req.body, ip);

  // Grant access level to generated user
  const accessLevels = await accessLevelService.assignAccessLevelToUserByUser(user);
  // Create initial Config file for API
  await configService.addConfig(hardCodeConfig);
  // Create Username and password for Landbanl
  await credentialsService.createCredential(credentials);
  // create group apis
  await apiToken.createGroupApiEndpoints(groupEndpoints);
  
  user.accessLevels = accessLevels.id;
  user.save();

  const initialLimitation = {
    userId: user._id,
    limitType: "ip",
    // uncomment if you want specific ip address to be added for initialsuperadmin
    // value: ip
    value: 'all'

  }
  // Allow created superadmin to login fifth
  await userLimitationsService.createLimitation(initialLimitation);
  const tokens = await tokenService.generateAuthTokens(user);

  // Remove security code for safety sixth
  process.env['REGISTRATION_CODE'] = null;
  // Uncomment if email verification is required.
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  // await emailService.sendVerificationEmail(redirectUri, user.email, verifyEmailToken);

  res.status(httpStatus.CREATED).send({ user, tokens });
});
const getInfoFromIpAddress = async (ip) => {
  try {
    const ipInfo = await axios.get(`https://api.ip2location.io/?key=7C5384E65E3B5B520A588FB8F9281719&ip=${ip}&format=json`);
    return ipInfo;

  } catch (error) {
    console.error(error);
  }
};

const login = catchAsync(async (req, res) => {
  const ip = req.ip;
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password, ip);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.query.callback, req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  let host = `${req.get("host")}`;
  const redirectUri = `${req.protocol}://${host}/v1/auth`;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(redirectUri, req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send('Your email has been verified.');
});
const appInitialize = catchAsync(async (req, res) => {
  process.env['REGISTRATION_CODE'] = Math.random().toString(36).slice(2);
  // Remove initiated code after 1 minute
  setTimeout(
    () => {
      process.env['REGISTRATION_CODE'] = null;
    }, 300000);
  const superAdminCode = process.env.REGISTRATION_CODE;
  await emailService.sendSuperAdminCode(superAdminCode, config.email.owner);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  appInitialize,
  initialSuperAdminRegistration,
  getInfoFromIpAddress,
  connectToServer
};
