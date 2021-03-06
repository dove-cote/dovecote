'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const States = [
    'running',
    'terminated',
    'error'
];

const projectSchema = new Schema({
    name: {type: String, required: true},
    services: [{type: Schema.Types.ObjectId, ref: 'Service'}],
    owner: {ref: 'User', required: true, type: Schema.Types.ObjectId},
    multicastIP_: String,
    state: {type: String, enum: States, default: 'terminated'},
    deploy: {type: Schema.Types.Mixed},
    lastDeploy: Date
}, {timestamps: true});


projectSchema.plugin(deepPopulate, {});

projectSchema.index({ name: 1, owner: 1}, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
