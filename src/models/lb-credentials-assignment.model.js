const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const landbankCredentialsAssignmentSchema = mongoose.Schema(
  {
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", autopopulate: true },
    credential: { type: mongoose.Schema.Types.ObjectId, ref: "Credentials", autopopulate: true },
    deleted: {
      default: false,
      type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
landbankCredentialsAssignmentSchema.plugin(toJSON);
landbankCredentialsAssignmentSchema.plugin(paginate);
landbankCredentialsAssignmentSchema.plugin(require('mongoose-autopopulate'));

/**
 * @typedef LandbankCredentialsAssignment
 */
const LandbankCredentialsAssignment = mongoose.model('LandbankCredentialsAssignment', landbankCredentialsAssignmentSchema);

module.exports = LandbankCredentialsAssignment;
