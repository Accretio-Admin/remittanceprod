const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { credentialsService, ubxService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getBankInstapay = catchAsync(async (req, res) => {
    const banks = await ubxService.getBankInstapay();
    res.status(httpStatus.OK).send(banks);
});

const getPurposeInstapay = catchAsync(async (req, res) => {
    const purposes = await ubxService.getPurposeInstapay();
    res.status(httpStatus.OK).send(purposes);
});

const postValidateInstapay = catchAsync(async (req, res) => {
    const validation = await ubxService.postValidateInstapay(req.body);
    res.status(httpStatus.OK).send(validation);
});

const postProcessInstapay = catchAsync(async (req, res) => {
    const processing = await ubxService.postProcessInstapay(req.body);
    res.status(httpStatus.OK).send(processing);
});

const getBankPesonet = catchAsync(async (req, res) => {
    const banks = await ubxService.getBankPesonet();
    res.status(httpStatus.OK).send(banks);
});

const getPurposePesonet = catchAsync(async (req, res) => {
    const purposes = await ubxService.getPurposePesonet();
    res.status(httpStatus.OK).send(purposes);
});

const postValidatePesonet = catchAsync(async (req, res) => {
    const validation = await ubxService.postValidatePesonet(req.body);
    res.status(httpStatus.OK).send(validation);
});

const postProcessPesonet = catchAsync(async (req, res) => {
    const processing = await ubxService.postProcessPesonet(req.body);
    res.status(httpStatus.OK).send(processing);
});

const checkStatusBank = catchAsync(async (req, res) => {
    const transactionNumber = req.params.transactionNumber;
    const status = await ubxService.checkStatusBank(transactionNumber);
    res.status(httpStatus.OK).send(status);
});

const getBillers = catchAsync(async (req, res) => {
    const billers = await ubxService.getBillers();
    res.status(httpStatus.OK).send(billers);
});

const getBillerRef = catchAsync(async (req, res) => {
    const billerCode = req.params.billerCode;
    const billerRef = await ubxService.getBillerRef(billerCode);
    res.status(httpStatus.OK).send(billerRef);
});

const postValidateBiller = catchAsync(async (req, res) => {
    const validation = await ubxService.postValidateBiller(req.body);
    res.status(httpStatus.OK).send(validation);
});

const postProcessBiller = catchAsync(async (req, res) => {
    const transactionNumber = req.params.transactionNumber;
    const processing = await ubxService.postProcessBiller(transactionNumber);
    res.status(httpStatus.OK).send(processing);
});

const checkStatusBiller = catchAsync(async (req, res) => {
    const status = await ubxService.checkStatusBiller(req.body);
    res.status(httpStatus.OK).send(status);
});

module.exports = {
    getBankInstapay,
    getPurposeInstapay,
    postValidateInstapay,
    postProcessInstapay,
    getBankPesonet,
    getPurposePesonet,
    postValidatePesonet,
    postProcessPesonet,
    checkStatusBank,
    getBillers,
    getBillerRef,
    postValidateBiller,
    postProcessBiller,
    checkStatusBiller,
};