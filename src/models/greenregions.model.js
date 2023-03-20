const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const greenRegionsSchema = mongoose.Schema(
  {
    countryCode: {
      default: "",
      type: String,
    },
    deleted: {
      default: false,
      type: Boolean
    },
    flag: {
      default: "",
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
greenRegionsSchema.plugin(toJSON);
greenRegionsSchema.plugin(paginate);

/**
 * @typedef GreenRegion
 */
const GreenRegions = mongoose.model('GreenRegions', greenRegionsSchema);

module.exports = GreenRegions;
