const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  xpostBalance,
  xpostProducList,
  xpostPrefixList,
  xpostTelcoStatus,
  xpostTopupRequest,
  xpostTopupInquiry,
  xpostEpinRequest,
  xpostEpinInquiry,
  xpostOtherRequest,
  xpostOtherInquiry,
  xpostTransportRequest,
  xpostTransportInquiry,
} = require('../services/venload-service');
const ApiError = require('../utils/ApiError');

const postBalance = catchAsync(async (req, res) => {
  const balance = await xpostBalance(req.body);
  res.status(httpStatus.OK).send(balance);
});

const postProductList = catchAsync(async (req, res) => {
  const productList = await xpostProducList(req.body);
  res.status(httpStatus.OK).send(productList);
});

const postPrefixList = catchAsync(async (req, res) => {
  const prefixList = await xpostPrefixList(req.body);
  res.status(httpStatus.OK).send(prefixList);
});

const postTelcoStatus = catchAsync(async (req, res) => {
  const telcoStatus = await xpostTelcoStatus(req.body);
  res.status(httpStatus.OK).send(telcoStatus);
});

const postTopupRequest = catchAsync(async (req, res) => {
  const topupRequest = await xpostTopupRequest(req.body);
  res.status(httpStatus.OK).send(topupRequest);
});

const postTopupInquiry = catchAsync(async (req, res) => {
  const topupInquiry = await xpostTopupInquiry(req.body);
  res.status(httpStatus.OK).send(topupInquiry);
});

const postEpinRequest = catchAsync(async (req, res) => {
  const epinRequest = await xpostEpinRequest(req.body);
  res.status(httpStatus.OK).send(epinRequest);
});

const postEpinInquiry = catchAsync(async (req, res) => {
  const epinInquiry = await xpostEpinInquiry(req.body);
  res.status(httpStatus.OK).send(epinInquiry);
});

const postOtherRequest = catchAsync(async (req, res) => {
  const otherRequest = await xpostOtherRequest(req.body);
  res.status(httpStatus.OK).send(otherRequest);
});

const postOtherInquiry = catchAsync(async (req, res) => {
  const otherInquiry = await xpostOtherInquiry(req.body);
  res.status(httpStatus.OK).send(otherInquiry);
});

const postTransportRequest = catchAsync(async (req, res) => {
  const transportRequest = await xpostTransportRequest(req.body);
  res.status(httpStatus.OK).send(transportRequest);
});

const postTransportInquiry = catchAsync(async (req, res) => {
  const transportInquiry = await xpostTransportInquiry(req.body);
  res.status(httpStatus.OK).send(transportInquiry);
});

module.exports = {
  postBalance,
  postProductList,
  postPrefixList,
  postTelcoStatus,
  postTopupRequest,
  postTopupInquiry,
  postEpinRequest,
  postEpinInquiry,
  postOtherRequest,
  postOtherInquiry,
  postTransportRequest,
  postTransportInquiry,
};