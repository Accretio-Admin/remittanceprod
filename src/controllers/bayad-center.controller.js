const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { credentialsService, bayadcenterService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getBillers = catchAsync(async (req, res) => {
    const billers = await bayadcenterService.getBillers();
    res.status(httpStatus.OK).send(billers);
});

const getBiller = catchAsync(async (req, res) => {
    const biller = await bayadcenterService.getBiller(req.params.billerId);
    res.status(httpStatus.OK).send(biller);
});

const getBillerFees = catchAsync(async (req, res) => {
    const fees = await bayadcenterService.getBillerFees(req.params.billerId);
    res.status(httpStatus.OK).send(fees);
});

const getBillerAccount = catchAsync(async (req, res) => {
    const accountDetails = await bayadcenterService.getBillerAccount(req.params.billerId, req.params.accountId, req.query.paymentMethod, req.query.amount, req.query.otherCharges);
    res.status(httpStatus.OK).send(accountDetails);
});

const createBillerPayment = catchAsync(async (req, res) => {
    const payment = await bayadcenterService.createBillerPayment(req.params.billerId, req.body.clientReference, req.body.validationNumber);
    res.status(httpStatus.CREATED).send(payment);
});

const getBillerPayment = catchAsync(async (req, res) => {
    const paymentDetails = await bayadcenterService.getBillerPayment(req.params.billerId, req.params.paymentId);
    res.status(httpStatus.OK).send(paymentDetails);
});

const getWallets = catchAsync(async (req, res) => {
    const wallets = await bayadcenterService.getWallets();
    res.status(httpStatus.OK).send(wallets);
});

module.exports = {
    getBillers,
    getBiller,
    getBillerFees,
    getBillerAccount,
    createBillerPayment,
    getBillerPayment,
    getWallets,
};
