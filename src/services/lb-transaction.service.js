const httpStatus = require('http-status');
const ObjectId = require('mongoose/lib/types/objectid');
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
const totalAccumulatedAmountByDate = async (daily=false) => {
    let created = {
        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    }
    if(daily){
        created = {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
          };
    }
    return await LandbankTrasaction.aggregate([
        {
          "$match": {
            createdAt: created
          },
        },
        {
          $group: {
            _id: null,
            totalTransactions: {
              $sum: "$amount"
            },
          }
        }
      ])
    // const transactions = await LandbankTrasaction.paginate(filter, options);;
    // return transactions;
};
const checkDuplicatedInLastXMinutes = async (minutes=10, txInfo) => {
    created = {
        $gte: new Date(new Date() - minutes * 60 * 1000)
    };
    return await LandbankTrasaction.aggregate([
        {
          "$match": {
            createdAt: created,
            amount: parseFloat(txInfo.amount),
            receiver: txInfo.receiver
          },
        },
        {
          $group: {
            _id: null,
            documents: {
                $count: {}
            }
          }
        }
      ])
    // const transactions = await LandbankTrasaction.paginate(filter, options);;
    // return transactions;
};
module.exports = {
    createTransaction,
    queryTransactions,
    totalAccumulatedAmountByDate,
    checkDuplicatedInLastXMinutes
};
