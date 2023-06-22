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
            return response.data.accessToken;
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
const xgetBankInstapay = () => apiCallUBX("get", "/instapay/banks");
const xgetPurposeInstapay= () => apiCallUBX("get", "/instapay/purpose");
const xpostValidateInstapay = (data) => apiCallUBX("post", "/instapay/validate", data);
const xpostProcessInstapay = (data) => apiCallUBX("post", "/instapay/process/direct", data);

// Pesopay Functions
const xgetBankPesonet = () => apiCallUBX("get", "/pesonet/banks");
const xgetPurposePesonet = () => apiCallUBX("get", "/pesonet/purpose");
const xpostValidatePesonet = (data) => apiCallUBX("post", "/pesonet/validate", data);
const xpostProcessPesonet = (data) => apiCallUBX("post", "/pesonet/process/direct", data);
//check bank for both
const xcheckStatusBank = (transactionNumber) => apiCallUBX("get", `/checkStatus/transaction/${transactionNumber}`);

//biller functions
const xgetBillers = () => apiCallUBX("get", `/paybills/billers`);
const xgetBillerRef = (billerCode) => apiCallUBX("get", `/paybills/billers/${billerCode}`);
const xpostValidateBiller = (data) => apiCallUBX("post", "/paybills/validate", data);
const xpostProcessBiller = (transactionNumber) => apiCallUBX("get", `/paybills/direct/process/${transactionNumber}`);
const xcheckStatusBiller = () => apiCallUBX("get", `/paybills`, data);

module.exports = {
  
    xgetBankInstapay, 
    xgetPurposeInstapay, 
    xpostValidateInstapay,
	xpostProcessInstapay,
	xgetBankPesonet,
	xgetPurposePesonet,
	xpostValidatePesonet,
	xpostProcessPesonet,
	xcheckStatusBank,
	xgetBillers,
	xgetBillerRef,
	xpostValidateBiller,
	xpostProcessBiller,
	xcheckStatusBiller
	
	
};