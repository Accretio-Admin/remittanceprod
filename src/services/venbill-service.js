

const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

const baseURL = 'https://demo.pinoypay.com/unified/api';



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
const xpostPulldata = (data) => apiCall("post",'/pulldata', data);
const xpostValidate = (data) => apiCall("post",'/validate', data);
const xpostProcess = (data) => apiCall("post",'/process', data);
const xpostInquiry = (data) => apiCall("post",'/inquiry', data);
const xpostReceipt = (data) => apiCall("post",'/receipt', data);


module.exports = {
  
    xpostBalance,
	xpostPulldata,
	xpostValidate,
	xpostProcess,
	xpostInquiry,
	xpostReceipt,

};