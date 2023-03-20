const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const credentialSchema = mongoose.Schema(
  {
    username: {
        default: "",
        type: String,
        required: true
    },
    password: {
        default: "",
        type: String,
        required: true,
        private: true,
    },
    communityCode: {
        default: "",
        type: String,
        required: true
    },
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
credentialSchema.plugin(toJSON);
credentialSchema.plugin(paginate);

/**
 * @typedef Credentials
 */
const Credentials = mongoose.model('Credentials', credentialSchema);


module.exports = Credentials;
