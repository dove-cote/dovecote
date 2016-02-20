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
    name: {type: String, default: 'Untitled Component'},
    type: {type: String, enum: types},
    namespace: {type: String},
    external: {type: Boolean, default: false},
    key: {type: String, require: true, unique: true}
}, {timestamps: true});


componentSchema.statics.ComponentTypes = types;
componentSchema.index({ key: 1}, { unique: true });


module.exports = mongoose.model('Component', componentSchema);
