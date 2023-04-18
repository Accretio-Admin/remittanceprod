const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const axios = require("axios");

const baseURL = process.env.BAYAD_CENTER_BASE_URL;
const bayadcenterUsername = `2lecblhoande1j7dhebk1ls57i`;
const bayadcenterPassword = `t3bjmtmd09jfiu2vfho21e071gbj8v8bon3itdrqcrj1p7jse66`;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
const requestToken = async () => {
    try {
        const response = await axiosInstance.post(
            "/partners/oauth/token",
            {
                grant_type: "client_credentials",
                tpa_id: "U123",
                scope: "mecom-auth/all",
            },
            {
                auth: {
                    username: bayadcenterUsername,
                    password: bayadcenterPassword,
                },
            }
        );

        if (response.status === 200) {
            return response.data.access_token;
        }
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error creating token for Bayad Center");
    }
};
const axiosAuthInstance = async () => {
    const token = await requestToken();
    return axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};
const apiCall = async (method, url, data) => {
    const authAxios = await axiosAuthInstance();
    const response = await authAxios[method](url, data);
    return response.data;
};
const getBillers = () => apiCall("get", "/billers");
const getBiller = (billerCode) => apiCall("get", `/billers/${billerCode}`);
const getBillerFees = (billerCode) => apiCall("get", `/billers/${billerCode}/fees`);
const getAccountDetails = (billerCode, accountNumber, paymentMethod, amount, otherCharges) =>
    apiCall("get", `/billers/${billerCode}/accounts/${accountNumber}`, { paymentMethod, amount, otherCharges });
const createPayment = (billerCode, clientReference, validationNumber) =>
    apiCall("post", `/billers/${billerCode}/payments`, { clientReference, validationNumber });
const getPaymentDetails = (billerCode, paymentId) => apiCall("get", `/billers/${billerCode}/payments/${paymentId}`);
const getWallets = () => apiCall("get", "/wallets");

module.exports = {
    getBillers,
    getBiller,
    getBillerFees,
    getAccountDetails,
    createPayment,
    getPaymentDetails,
    getWallets,
};
