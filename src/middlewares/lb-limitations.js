const httpStatus = require("http-status");
const { configService, apiToken, transactionService } = require("../services");
const ApiError = require("../utils/ApiError");
const moment = require('moment-timezone');
const { landbankController } = require("../controllers");

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
const perTxAmountLimit = async (userRequestedAmount, perTransactionLimit) => {
    // const totalAmount = await transactionService.totalAccumulatedAmountByDate(true);
    // return false;
    const permittedToProceedWithAmount = (parseFloat(userRequestedAmount)<=parseFloat(perTransactionLimit));
    if(!permittedToProceedWithAmount){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your requested amount is higher than per transaction allowance.');
    }
}
const perDayTxAmountLimit = async (userRequestedAmount, perDayTransactionLimit) => {
    const totalAmount = await transactionService.totalAccumulatedAmountByDate(true);
    if((totalAmount && totalAmount[0] && totalAmount[0].totalTransactions > perDayTransactionLimit)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your requested amount is higher than per day transaction allowance.');
    }
    if(totalAmount && totalAmount[0] && ((parseFloat(totalAmount[0].totalTransactions)+(parseFloat(userRequestedAmount)) > +parseFloat(perDayTransactionLimit)))){
        throw new ApiError(httpStatus.BAD_REQUEST, `You'll reach your maximum daily allowance after this transaction. This transaction is not allowed.`);
    }
}
const totalTxAmountLimit = async (userRequestedAmount, transactionTotalLimit) => {
    const totalAmount = await transactionService.totalAccumulatedAmountByDate(false);
    if((totalAmount[0].totalTransactions > transactionTotalLimit)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your requested amount is higher than all time transaction allowance.');
    }
    if(((parseFloat(totalAmount[0].totalTransactions)+(parseFloat(userRequestedAmount)) > +parseFloat(transactionTotalLimit)))){
        throw new ApiError(httpStatus.BAD_REQUEST, `You'll reach your maximum allowance of all time after this transaction. This transaction is not allowed.`);
    }
}
const checkDuplicatedInLastXMinutes = async (duplicationAllowed, remitInfo) => {
    if(!duplicationAllowed){
        const isDuplicated = await transactionService.checkDuplicatedInLastXMinutes(1, remitInfo);
        if(isDuplicated && isDuplicated[0] && isDuplicated[0].documents > 0){
            throw new ApiError(httpStatus.BAD_REQUEST, `Duplication of transactions is not allowed. Please contact administration`);
        }
    }
}

const checkIfUserLimited = async (req, res, next) => {
    let config = await getConfig();
    config = config[0];
    rateAndFeeManagement = config.ratesFeesManagement;
    comissionType = Object.keys(rateAndFeeManagement).map((e)=> rateAndFeeManagement[e].active ? (rateAndFeeManagement[e].type = e,rateAndFeeManagement[e]) : null ).filter((v) => v!= null)[0];
    try {
        await totalTxAmountLimit(req.body.remittance.beneficiaryAmountConverted, config.transaction.transactionAmount.transactionAmountLimit.transactionTotalAmount);
        await perTxAmountLimit(req.body.remittance.beneficiaryAmountConverted, config.transaction.transactionAmount.transactionAmountLimit.perTransactionAmount);
        await perDayTxAmountLimit(req.body.remittance.beneficiaryAmountConverted, config.transaction.transactionAmount.transactionAmountLimit.perDayTransactionAmount);
        await checkDuplicatedInLastXMinutes(
            config.transaction.frequency.duplication,
            {
                amount: req.body.remittance.beneficiaryAmountConverted,
                receiver: `${req.body.remittance.beneficiarysLastName}, ${req.body.remittance.beneficiarysFirstName} ${req.body.remittance.beneficiarysMiddleName}`
            }
        )
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
