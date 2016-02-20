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


const componentSchema = new Schema({
    type: {type: String, enum: types}
}, {timestamps: true});


componentSchema.statics.ComponentTypes = types;


module.exports = mongoose.model('Component', componentSchema);
