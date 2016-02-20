'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const maxCodeLength = 100 * 1024; // 100kB


const serviceSchema = new Schema({
    name: {type: String, default: 'Untitled Service'},
    instance: {type: Number, default: 1},
    components: [{type: Schema.Types.ObjectId, ref: 'Component'}],
    code: {type: String, maxlength: maxCodeLength},
    meta: {type: Schema.Types.Mixed},
    key: {type: String, require: true, unique: true}
}, {timestamps: true});

serviceSchema.index({ key: 1}, { unique: true });

module.exports = mongoose.model('Service', serviceSchema);
