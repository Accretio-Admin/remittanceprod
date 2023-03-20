const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const apiTokensSchema = mongoose.Schema(
  {
    token: {
      default: "",
      type: String,
      unique: true,
    },
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true,
    },
    expiration: {
      default: new Date(),
      type: Date,
    },
    active: {
      default: true,
      type: Boolean,
    },
    endpointGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApiGroups",
        autopopulate: true,
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
apiTokensSchema.plugin(toJSON);
apiTokensSchema.plugin(paginate);
apiTokensSchema.plugin(require('mongoose-autopopulate'));
const ApiTokens = mongoose.model("ApiTokens", apiTokensSchema);

module.exports = ApiTokens;
