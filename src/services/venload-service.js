

const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

const baseURL = 'https://test.atmprepaidsolutions.com/plr0422/api/v1';



const axiosAuthInstance = async (signature) => {
    

    return axios.create({
        baseURL,
        headers: {
           'Content-Type': 'application/json',
			Signature: signature,
        },
    });
};

const apiCall = async (method, url, data) => {
	const filePathName = '../keys/10502200001.private.pem';
	const payload = '{"id":"10502200001","uid":"api","pwd":"p@ssw0rD","data":{}}';
	const payloadObj = JSON.parse(payload);
	payloadObj.data = data; // Assign the provided data to the `data` property
	const payloadString = JSON.stringify(payloadObj);


	// Read the private key file
	const privateKey = fs.readFileSync(filePathName);

	// Sign the payload with the private key
	const sign = crypto.createSign('RSA-SHA1');
	sign.write(payloadString);
	sign.end();
	const signature = sign.sign(privateKey, 'base64');
	
   const authAxios = await axiosAuthInstance(signature);
  
 

  const response = await authAxios[method](url, payloadObj);
  return response.data;
};
const xpostBalance = (data) => apiCall("post",'/balance', data);
const xpostProducList = (data) => apiCall("post",'/product-list', data);
const xpostPrefixList = (data) => apiCall("post",'/prefix-list', data);
const xpostTelcoStatus = (data) => apiCall("post",'/telco-status', data);
const xpostTopupRequest = (data) => apiCall("post",'/topup-request', data);
const xpostTopupInquiry = (data) => apiCall("post",'/topup-inquiry', data);
const xpostEpinRequest = (data) => apiCall("post",'/epin-request', data);
const xpostEpinInquiry= (data) => apiCall("post",'/epin-inquiry', data);
const xpostOtherRequest = (data) => apiCall("post",'/other-request', data);
const xpostOtherInquiry = (data) => apiCall("post",'/other-inquiry', data);
const xpostTransportRequest = (data) => apiCall("post",'/transport-request', data);
const xpostTransportInquiry = (data) => apiCall("post",'/transport-inquiry', data);
module.exports = {
  
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
};