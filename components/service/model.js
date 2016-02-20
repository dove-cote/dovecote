'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const serviceSchema = new Schema({
    name: {type: String, default: 'Untitled Service'},
    instance: {type: Number, default: 1},
    components: [{type: Schema.Types.ObjectId, ref: 'Component'}]
}, {timestamps: true});


module.exports = mongoose.model('Service', serviceSchema);
