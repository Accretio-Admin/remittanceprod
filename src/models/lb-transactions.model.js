const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const landbankTransactionSchema = mongoose.Schema(
  {
    transactionCode: {
      default: "",
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" , autopopulate: true },
    ip: {
      default: "",
      type: String,
      required: true,
    },
    type: {
      default: "",
      type: String,
    },
    status: {
      default: "",
      type: String,
    },
    result: {
      default: "",
      type: String,
    },
    receiver: {
      default: "",
      type: String,
    },
    amount: {
      type: Number,
      default: 0
    },
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User" , autopopulate: true },
    comission: {
      default: 0,
      type: Number,
    },
    comissionType: {
      default: "",
      enum: ['markup','percentage'],
      type: String,
    },
    deleted: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
landbankTransactionSchema.plugin(toJSON);
landbankTransactionSchema.plugin(paginate);
landbankTransactionSchema.plugin(require('mongoose-autopopulate'));
/**
 * @typedef LandbankTransaction
 */
const LandbankTransaction = mongoose.model(
  "LandbankTransaction",
  landbankTransactionSchema
);

module.exports = LandbankTransaction;
