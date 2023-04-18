const soapCurlHeader = `curl --location --request POST 'http://222.127.109.64:9080/wstest/ws/cxf/remittance?wsdl' --header 'Content-Type: text/xml' --data-raw `
const inquirySoapBuilder = (credentials) => {
  return `${soapCurlHeader}'<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:rem=\"http://remittance.webservice.carnelian.ccti.com/\"><soapenv:Header/><soapenv:Body><rem:inquireTransaction><arg0><communityCd>${credentials.communityCode}</communityCd><password>${credentials.password}</password><username>${credentials.username}</username></arg0><arg1>test001</arg1></rem:inquireTransaction></soapenv:Body></soapenv:Envelope>'`
}
const remittanceSoapBuilder = (credentials, remittanceDetails) => {
  return `${soapCurlHeader}'<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:rem=\"http://remittance.webservice.carnelian.ccti.com/\"> <soapenv:Header/> <soapenv:Body> <rem:createTransaction>  <arg0>  <communityCd>${credentials.communityCode}</communityCd>  <password>${credentials.password}</password>  <username>${credentials.username}</username> </arg0>  <arg1>${remittanceDetails.applicationNumber}</arg1>  <arg2>${remittanceDetails.remittersFirstName}</arg2>  <arg3>${remittanceDetails.remittersMiddleName}</arg3> <arg4>${remittanceDetails.remittersLastName}</arg4>  <arg5>${remittanceDetails.beneficiarysFirstName}</arg5>  <arg6>${remittanceDetails.beneficiarysMiddleName}</arg6>  <arg7>${remittanceDetails.beneficiarysLastName}</arg7>  <arg8>${remittanceDetails.beneficiarysAddress1}</arg8>  <arg9>${remittanceDetails.beneficiarysAddress2}</arg9> <arg10>${remittanceDetails.beneficiarysAddress3}</arg10>  <arg11>${remittanceDetails.beneficiarysTelephoneNumber}</arg11>  <arg12>${remittanceDetails.beneficiarysMobileNumber}</arg12>  <arg13>${remittanceDetails.bankCode}</arg13> <arg14>${remittanceDetails.bankName}</arg14> <arg15>${remittanceDetails.beneficiaryAccountNumber}</arg15> <arg16>${remittanceDetails.beneficiaryAmountConverted}</arg16> <arg17>${remittanceDetails.foreignOfficeServiceCode}</arg17> <arg18>${remittanceDetails.branchCode}</arg18><arg19>${remittanceDetails.messageToRecipient}</arg19> <arg20>${remittanceDetails.beneficiarysAreaCode}</arg20> <arg21>${remittanceDetails.beneficiarysCurrencyCode}</arg21><arg22>${remittanceDetails.remitterId}</arg22><arg23>${remittanceDetails.beneficiaryId}</arg23><arg24>${remittanceDetails.dateOfRemittance}</arg24><arg25>${remittanceDetails.remitterrsAddress1}</arg25><arg26>${remittanceDetails.remittersAddress2}</arg26><arg27>${remittanceDetails.remittersCountryCode}</arg27> <arg28>${remittanceDetails.transactionSecurityCode}</arg28><arg29>${remittanceDetails.outletCode}</arg29><arg30>${remittanceDetails.merchantCode}</arg30><arg31>${remittanceDetails.billsPaymentField1}</arg31><arg32>${remittanceDetails.cardNumber}</arg32> </rem:createTransaction> </soapenv:Body> </soapenv:Envelope>'`
}
const txDetailsSoapBuilder = (credentials, tx) => {
  return `${soapCurlHeader}'<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:rem=\"http://remittance.webservice.carnelian.ccti.com/\"><soapenv:Header/><soapenv:Body><rem:inquireTransaction><arg0><communityCd>${credentials.communityCode}</communityCd><password>${credentials.password}</password><username>${credentials.username}</username></arg0><arg1>${tx}</arg1></rem:inquireTransaction></soapenv:Body></soapenv:Envelope>'`
}
const inquiry = (credentials) => {
  return inquirySoapBuilder(credentials);
};
const remittance = (credentials, remittanceDetails) => {
  return remittanceSoapBuilder(credentials, remittanceDetails);
};
const txDetails = (credentials, tx) => {
  return txDetailsSoapBuilder(credentials, tx);
};

module.exports = {
  inquiry,
  remittance,
  txDetails
};
