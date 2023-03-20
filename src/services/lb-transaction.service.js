const httpStatus = require('http-status');
const { LandbankTrasaction } = require('../models');
const ApiError = require('../utils/ApiError');


const createTransaction = async (txBody) => {
    if (!txBody) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No transaction data to save.');
    }
    return LandbankTrasaction.create(txBody);
};
const queryTransactions = async (filter, options) => {
    const transactions = await LandbankTrasaction.paginate(filter, options);;
    return transactions;
};


module.exports = {
    createTransaction,
    queryTransactions
};
