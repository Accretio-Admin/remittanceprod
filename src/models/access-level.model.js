const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const accessLevelsSchema = mongoose.Schema(
  {
    role: {
      default: "",
      type: String,
    },
    accessLevel: {
      default: "",
      type: Object
    },
    deleted: {
      default: false,
      type: Boolean
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
accessLevelsSchema.plugin(toJSON);
accessLevelsSchema.plugin(paginate);

/**
 * @typedef GreenRegion
 */
const AccessLevels = mongoose.model('AccessLevels', accessLevelsSchema);

module.exports = AccessLevels;
