const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { xgetBankInstapay, xgetPurposeInstapay, xpostValidateInstapay, xpostProcessInstapay, xgetBankPesonet, xgetPurposePesonet, xpostValidatePesonet, xpostProcessPesonet, xcheckStatusBank, xgetBillers, xgetBillerRef, xpostValidateBiller, xpostProcessBiller, xcheckStatusBiller } = require('../services/ubx-service');
const ApiError = require('../utils/ApiError');


const getBankInstapay = catchAsync(async (req, res) => {
  const banks = await xgetBankInstapay();
  res.status(httpStatus.OK).send(banks);
});

const getPurposeInstapay = catchAsync(async (req, res) => {
  const purposes = await xgetPurposeInstapay();
  res.status(httpStatus.OK).send(purposes);
});

const postValidateInstapay = catchAsync(async (req, res) => {
  const validation = await xpostValidateInstapay(req.body);
  res.status(httpStatus.OK).send(validation);
});

const postProcessInstapay = catchAsync(async (req, res) => {
  const processing = await xpostProcessInstapay(req.body);
  res.status(httpStatus.OK).send(processing);
});

const getBankPesonet = catchAsync(async (req, res) => {
  const banks = await xgetBankPesonet();
  res.status(httpStatus.OK).send(banks);
});

const getPurposePesonet = catchAsync(async (req, res) => {
  const purposes = await xgetPurposePesonet();
  res.status(httpStatus.OK).send(purposes);
});

const postValidatePesonet = catchAsync(async (req, res) => {
  const validation = await xpostValidatePesonet(req.body);
  res.status(httpStatus.OK).send(validation);
});

const postProcessPesonet = catchAsync(async (req, res) => {
  const processing = await xpostProcessPesonet(req.body);
  res.status(httpStatus.OK).send(processing);
});

const checkStatusBank = catchAsync(async (req, res) => {
  const transactionNumber = req.params.transactionNumber;
  const status = await xcheckStatusBank(transactionNumber);
  res.status(httpStatus.OK).send(status);
});

const getBillers = catchAsync(async (req, res) => {
  const billers = await xgetBillers();
  res.status(httpStatus.OK).send(billers);
});

const getBillerRef = catchAsync(async (req, res) => {
  const billerCode = req.params.billerCode;
  const billerRef = await xgetBillerRef(billerCode);
  res.status(httpStatus.OK).send(billerRef);
});

const postValidateBiller = catchAsync(async (req, res) => {
  const validation = await xpostValidateBiller(req.body);
  res.status(httpStatus.OK).send(validation);
});

const postProcessBiller = catchAsync(async (req, res) => {
  const transactionNumber = req.params.transactionNumber;
  const processing = await xpostProcessBiller(transactionNumber);
  res.status(httpStatus.OK).send(processing);
});

const checkStatusBiller = catchAsync(async (req, res) => {
  const status = await xcheckStatusBiller(req.body);
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
