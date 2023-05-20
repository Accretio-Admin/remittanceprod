const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const axios = require("axios");

//const baseURL = process.env.BAYAD_CENTER_BASE_URL;
const baseURL = 'https://api.stg.i2i.ph/api-apic';
const ubxUsername = 'i2iacct+ecashpaytxnmaker';
const ubxPassword = 'P@ssw0rd123!';
const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});


const requestTokenUBX = async () => {
    try {
        const response = await axiosInstance.post(
             "/auth/token",
            {
                username: ubxUsername,
                password: ubxPassword,
            },
            {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            return response.data.access_token;
        }
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error creating token for UBX");
    }
};

const axiosAuthInstanceUBX = async () => {
    const token = await requestTokenUBX();
    return axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};

const apiCallUBX = async (method, url, data) => {
    const authAxios = await axiosAuthInstanceUBX();
    const response = await authAxios[method](url, data);
    return response.data;
};

// Instapay Functions
const getBankInstapay = () => apiCallUBX("get", "/instapay/banks");
const getPurposeInstapay= () => apiCallUBX("get", "/instapay/purpose");
const postValidateInstapay = (data) => apiCallUBX("post", "/instapay/validate", data);
const postProcessInstapay = (data) => apiCallUBX("post", "/instapay/process/direct", data);

// Pesopay Functions
const getBankPesonet = () => apiCallUBX("get", "/pesonet/banks");
const getPurposePesonet = () => apiCallUBX("get", "/pesonet/purpose");
const postValidatePesonet = (data) => apiCallUBX("post", "/pesonet/validate", data);
const postProcessPesonet = (data) => apiCallUBX("post", "/pesonet/process/direct", data);
//check bank for both
const checkStatusBank = (transactionNumber) => apiCallUBX("get", `/checkStatus/transaction/${transactionNumber}`);

//biller functions\
const getBillers = () => apiCallUBX("get", `/paybills/billers`);
const getBillerRef = (billerCode) => apiCallUBX("get", `/paybills/billers/${billerCode}`);
const postValidateBiller = (data) => apiCallUBX("post", "/paybills/validate", data);
const postProcessBiller = (transactionNumber) => apiCallUBX("get", `/paybills/direct/process/${transactionNumber}`);
const checkStatusBiller = () => apiCallUBX("get", `/paybills`, data);

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
	checkStatusBiller
	
	
};