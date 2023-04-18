const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { credentialsService, transactionService, apiToken, tokenService, userService,  } = require('../services');
const { inquiry, remittance, txDetails } = require('../utils/landbank-query-converter');
const { readFileSync } = require('fs');
const { Client } = require('ssh2');
var parseString = require('xml2js').parseString;
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const ObjectId = require('mongoose/lib/types/objectid');
const connectToServer = (curl) => {
    return new Promise(async (resolve, reject) => {
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
                        resolve(returnData);
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
}
const accountInquiry = catchAsync(async (req, res) => {
    const userId = await tokenService.getUserField(req.headers.authorization, "id");
    const userCredntial = await credentialsService.isUserAssignedToAnyCredentials(userId);
    let curl = inquiry(userCredntial.credential);
    curl = curl.replace(/&lt;/g, '<');
    curl = curl.replace(/<!--Optional:-->/g, '');
    connectToServer(curl).then((response) => {
        res.status(httpStatus.CREATED).send(response);
    });
});
const remit = catchAsync(async (req, res) => {
    try{
        const userId = await tokenService.getUserField(req.headers.authorization.replace('Bearer ', ''), "id");
        const ip = req.ip;
        const remittanceInfo = req.body.remittance;
        const userCredntial = await credentialsService.isUserAssignedToAnyCredentials(userId);
        let curl = remittance(userCredntial.credential , remittanceInfo);
        const formula = {
            percentage : (originalValue, computingValue) => {return eval(`${originalValue}*${computingValue}/100`)},
            perCertainValueRoundedDown : (originalValue, certainValue, comission) => {return eval(`Math.floor(${originalValue}/${certainValue})*${comission})`)},
            perCertainValueRoundedUp : (originalValue, certainValue, comission) => {return eval(`Math.ceil(${originalValue}/${certainValue})*${comission})`)},
            certainValue : (certainValue) => {return certainValue}
        }
        connectToServer(curl).then(async (response) => {
            const status = response.errorMessageResponseList[0].errorMessage[0] == 'No Errors' ? 'successful' : 'failed'
            txInfo = {
                transactionCode: remittanceInfo.applicationNumber,
                user: userId,
                ip: ip,
                type: remittanceInfo.foreignOfficeServiceCode,
                amount: parseFloat(remittanceInfo.beneficiaryAmountConverted),
                status: status,
                result: JSON.stringify(response),
                referrer: res.locals.referrer,
                // No comission if tx was failed
                comission: (status=='successful') ? formula[res.locals.comissionType.type](remittanceInfo.beneficiaryAmountConverted, res.locals.comissionType.value) : 0,
                comissionType: res.locals.comissionType.type,
                receiver: `${remittanceInfo.beneficiarysLastName}, ${remittanceInfo.beneficiarysFirstName} ${remittanceInfo.beneficiarysMiddleName}`
            }
            await transactionService.createTransaction(txInfo);
            res.status(httpStatus.CREATED).send(response);
        });
        // txInfo = {
        //     transactionCode: [...Array(6)].map(() => Math.random().toString(36)[2]).join('').toUpperCase(),
        //     user: userId,
        //     ip: ip,
        //     type: "OP",
        //     status: 'pending',
        //     amount: 200,
        //     result: "{}"
        // }
        // await transactionService.createTransaction(txInfo);
        // let response = {
        //     "errorMessageResponseList": [
        //         {
        //             "errorCode": [
        //                 "099"
        //             ],
        //             "errorMessage": [
        //                 "No Errors"
        //             ]
        //         }
        //     ],
        //     "remittanceResponseList": [
        //         {
        //             "applicationNo": [
        //                 "LBP080880"
        //             ],
        //             "beneficiaryName": [
        //                 "LIM, JAIME K"
        //             ],
        //             "feedbackStatus": [
        //                 "Positive"
        //             ],
        //             "remitterName": [
        //                 "SANTOS, DANIEL RIOZHON"
        //             ],
        //             "transactionAmount": [
        //                 "1002.0"
        //             ],
        //             "transactionCurrency": [
        //                 "PHP"
        //             ],
        //             "transactionRefNo": [
        //                 "GPRTST_20230304000001"
        //             ]
        //         }
        //     ]
        // }
        // res.status(httpStatus.CREATED).send(response);
    }catch(error){
        throw new ApiError(httpStatus.BAD_REQUEST, error)
    }
});
const getTxDetails = catchAsync(async (req, res) => {
    const userId = await tokenService.getUserField(req.headers.authorization, "id");
    const tx = req.params.txId;
    const userCredntial = await credentialsService.isUserAssignedToAnyCredentials(userId);
    let curl = txDetails(userCredntial.credential , tx);
    connectToServer(curl).then((response) => {
        res.status(httpStatus.CREATED).send(response);
    });
});
const getTransactions = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'filter', 'populate']);
    const tokenDoc = await tokenService.verifyToken(req.headers.authorization.replace('Bearer ', ''), tokenTypes.ACCESS);
    const user = await userService.getUserById(tokenDoc.user);
    if(user.role == 'companyadmin'){
        filter.referrer = ObjectId(user.id);
    }
    const result = await transactionService.queryTransactions(filter, options);
    res.send(result);
});
module.exports = {
    accountInquiry,
    remit,
    getTxDetails,
    getTransactions
};
