'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    name: {type: String, required: true},
    services: [{type: Schema.Types.ObjectId, ref: 'Service'}],
    owner: {ref: 'User', required: true, type: Schema.Types.ObjectId},
    multicastIP_: String,
    lastDeploy: Date
}, {timestamps: true});


module.exports = mongoose.model('Project', projectSchema);
