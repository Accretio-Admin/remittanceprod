const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const logsSchema = mongoose.Schema(
    {
        enter: {
            type: Date,
            required: true,
            default: new Date()
        },
        exit: {
            type: Date,
            required: true,
            default: new Date()
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
