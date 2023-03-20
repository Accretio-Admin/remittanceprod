const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const apiGroupsSchema = mongoose.Schema(
  {
    name: {
      default: "",
      type: String,
    },
    endpoints: {
      type: Array,
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
apiGroupsSchema.plugin(toJSON);
apiGroupsSchema.plugin(paginate);

const ApiGroups = mongoose.model("ApiGroups", apiGroupsSchema);

module.exports = ApiGroups;
