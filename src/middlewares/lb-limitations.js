const httpStatus = require("http-status");
const { configService, apiToken } = require("../services");
const ApiError = require("../utils/ApiError");
const moment = require('moment-timezone');

let referrer = '';
let comissionType = '';
// Get full config
const getConfig = async () => {
    return await configService.getConfig();
}
// Check if transaction is duplicated
const txIsDuplicated = () => {
    
}
const apiKeyValidator = async(key, endpoint) => {
    const apikeyInfo = await apiToken.getToken(key);
    const permissionToUseEndpoint = apikeyInfo.endpointGroupId.endpoints.includes(endpoint);
    if(!key || key == '' || typeof key !== 'string' || !apikeyInfo){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid api key.');
    }
    if(!permissionToUseEndpoint){
        throw new ApiError(httpStatus.BAD_REQUEST, 'You are not allowed to perform action to this endpoint. Please contact administration.');
    }
    referrer = apikeyInfo.referrer.id;
}
const passedCutoffTime = (timeframe) => {
    const format = 'HH:mm:ss'
    const now = moment(new Date(), format).tz('Asia/Manila');
    const fromTime = moment(now,format).tz('Asia/Manila').set({h: moment(timeframe.cutoffStartTime).tz('Asia/Manila').hour(), m: moment(timeframe.cutoffStartTime).tz('Asia/Manila').minute()});
    const toTime = moment(now,format).tz('Asia/Manila').set({h: moment(timeframe.cutoffEndTime).tz('Asia/Manila').hour(), m: moment(timeframe.cutoffEndTime).tz('Asia/Manila').minute()});
    if(!now.isBetween(fromTime, toTime)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'out of cutoff time');
    }
}
const perTxAmountLimit = () => {
    
}
const totalTxAmountLimit = () => {
    
}

const checkIfUserLimited = async (req, res, next) => {
    let config = await getConfig();
    config = config[0];

    rateAndFeeManagement = config.ratesFeesManagement;
    comissionType = Object.keys(rateAndFeeManagement).map((e)=> rateAndFeeManagement[e].active ? (rateAndFeeManagement[e].type = e,rateAndFeeManagement[e]) : null ).filter((v) => v!= null)[0];
    try {
        // Check API key
        await apiKeyValidator(req.headers.apikey, req.originalUrl);
        // Check if within cutoff Time
        await passedCutoffTime(config.transaction.frequency.cutoffTime);
        res.locals.comissionType = comissionType;
        res.locals.referrer = referrer;
        next();
    } catch(error) {
        next(new ApiError(httpStatus.BAD_REQUEST, error)); 
    }
    // next(new ApiError(httpStatus.BAD_REQUEST, 'ssss'));
}

module.exports = {
    checkIfUserLimited
};
