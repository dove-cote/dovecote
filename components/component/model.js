'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const types = [
    'req',
    'res',
    'pub',
    'sub',
    'sockend',
    //'rest' maybe tomorrow
];


const maxCodeLength = 100 * 1024; // 100kB


const componentSchema = new Schema({
    type: {type: String, enum: types},
    code: {type: String, maxlength: maxCodeLength}
}, {timestamps: true});


componentSchema.statics.ComponentTypes = types;


module.exports = mongoose.model('Component', componentSchema);
