const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const configSchema = mongoose.Schema(
  {
    transaction: {
        frequency: {
          duplication: {
            type: Boolean,
            default: false
          },
          cutoffTime: {
            cutoffStartTime: {
                type: Date,
                default: new Date()
            },
            cutoffEndTime: {
                type: Date,
                default: new Date()
            },
          },
        },
        transactionAmount: {
          transactionAmountLimit: {
            perTransactionAmount: {
                type: Number,
                default: 0
            },
            perDayTransactionAmount: {
              type: Number,
              default: 0
          },
            transactionTotalAmount: {
                type: Number,
                default: 0
            },
          },
        },
    },
    apiRateLimiter: {
        totalNumber: {
            type: Number,
            default: 0
        },
        callPerSecond: {
            type: Number,
            default: 0
        },
        dailyLimit: {
            type: Number,
            default: 0
        },
    },
    ratesFeesManagement: {
        percentage: {
            value: {
                type: Number,
                default: 0
            },
            active: {
                type: Boolean,
                default: true
            },
        },
        markup: {
            value: {
                type: Number,
                default: 0
            },
            active: {
                type: Boolean,
                default: false
            },
        },
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
configSchema.plugin(toJSON);
configSchema.plugin(paginate);
configSchema.plugin(require('mongoose-autopopulate'));
const Config = mongoose.model("Config", configSchema);

module.exports = Config;
