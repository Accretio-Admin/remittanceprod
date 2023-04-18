const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const logsSchema = mongoose.Schema(
    {
        enterTime: {
            type: String,
            required: true,
        },
        enterDate: {
            type: String,
            required: true,
        },
        exitTime: {
            type: String,
            required: true,
        },
        exitDate: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
            default: ""
        },
        changes: {
            type: Array,
            required: true,
            default: []
        },
        duration: {
            type: Number,
            required: true,
            default: 0
        },
        deleted:  {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
logsSchema.plugin(toJSON);
logsSchema.plugin(paginate);

/**
 * @typedef logs
 */
const Logs = mongoose.model('Logs', logsSchema);

module.exports = Logs;