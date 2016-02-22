'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const monitorRecordSchema = new Schema({
    nodes: [{type: Schema.Types.Mixed}],
    links: [{type: Schema.Types.Mixed}],
    project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});


module.exports = mongoose.model('MonitorRecord', monitorRecordSchema);
