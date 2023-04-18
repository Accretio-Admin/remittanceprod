const hardCodeConfig = {
    "transaction": {
        "frequency": {
          "cutoffTime": {
            "cutoffStartTime": new Date("2014-08-18T09:59:54.000+00:00"),
            "cutoffEndTime":  new Date("2014-08-18T09:59:54.000+00:00")
          },
          "duplication": false
        },
        "transactionAmount": {
          "transactionAmountLimit": {
            "perTransactionAmount": 0,
            "transactionTotalAmount": 0
          }
        }
      },
      "apiRateLimiter": {
        "totalNumber": 0,
        "callPerSecond": 0,
        "dailyLimit": 0
      },
      "ratesFeesManagement": {
        "percentage": {
          "value": 0,
          "active": true
        },
        "markup": {
          "value": 0,
          "active": false
        }
      },
}
const credentials = {
    "username": "GPRSTEST1",
    "password": "test123",
    "communityCode": "GPRTST"
}
const groupEndpoints = {
    "name": "daniel",
    "endpoints": [
      "/v1/landbank/account/remittance",
      "a/b/c",
      "a/b/c",
      "a/b/c"
    ],
}
module.exports = {
    hardCodeConfig,
    credentials,
    groupEndpoints
}