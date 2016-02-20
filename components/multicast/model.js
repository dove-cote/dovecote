'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const multicastSchema = new Schema({
    ip: {type: String, required: true, unique: true},
    status: {type: Boolean, default: false},
    project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});


module.exports = mongoose.model('Multicast', multicastSchema);
