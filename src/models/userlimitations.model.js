const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userLimitationsSchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    limitType: {
        enum: ['ip', 'region'],
        required: true,
        type: String,
    },
    value: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userLimitationsSchema.plugin(toJSON);
userLimitationsSchema.plugin(paginate);
/**
 * @typedef GreenRegion
 */
const UserLimitations = mongoose.model('UserLimitations', userLimitationsSchema);

module.exports = UserLimitations;
