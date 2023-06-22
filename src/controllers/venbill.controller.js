const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  xpostBalance,
  xpostPulldata,
  xpostValidate,
  xpostProcess,
  xpostInquiry,
  xpostReceipt,
} = require('../services/venbill-service');
const ApiError = require('../utils/ApiError');

const balanceController = async (req, res) => {
  try {
    // Retrieve data from the request body
    const { userId } = req.body;

    // Make the API call to balance endpoint
    const balanceResponse = await xpostBalance({ userId });

    // Handle the response and send it back
    res.json(balanceResponse);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
};

const pulldataController = async (req, res) => {
  try {
    // Retrieve data from the request body
    const { userId } = req.body;

    // Make the API call to pulldata endpoint
    const pulldataResponse = await xpostPulldata({ userId });

    // Handle the response and send it back
    res.json(pulldataResponse);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
};

const validateController = async (req, res) => {
  try {
    // Retrieve data from the request body
    const { userId } = req.body;

    // Make the API call to validate endpoint
    const validateResponse = await xpostValidate({ userId });

    // Handle the response and send it back
    res.json(validateResponse);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
};

const processController = async (req, res) => {
  try {
    // Retrieve data from the request body
    const { userId } = req.body;

    // Make the API call to process endpoint
    const processResponse = await xpostProcess({ userId });

    // Handle the response and send it back
    res.json(processResponse);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
};

const inquiryController = async (req, res) => {
  try {
    // Retrieve data from the request body
    const { userId } = req.body;

    // Make the API call to inquiry endpoint
    const inquiryResponse = await xpostInquiry({ userId });

    // Handle the response and send it back
    res.json(inquiryResponse);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
};

const receiptController = async (req, res) => {
  try {
    // Retrieve data from the request body
    const { userId } = req.body;

    // Make the API call to receipt endpoint
    const receiptResponse = await xpostReceipt({ userId });

    // Handle the response and send it back
    res.json(receiptResponse);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  balanceController,
  pulldataController,
  validateController,
  processController,
  inquiryController,
  receiptController,
};