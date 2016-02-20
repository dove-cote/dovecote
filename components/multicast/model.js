'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const multicastSchema = new Schema({
    ip: {type: String, required: true, unique: true},
    active: {type: Boolean, default: false},
    project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});


/**
 * Reserves the next available ip address to a project.
 * @param {ObjectId} projectId
 * @returns {Promise}
 */
multicastSchema.statics.reserve = function(projectId) {
    return this
        .findOneAndUpdate(
            {active: false},
            {project: projectId, active: true},
            {new: true}
        )
        .exec()
        .then(multicast => {
            if (!multicast)
                throw new Error('Could not find an available ip address');

            return multicast.ip;
        });
}


/**
 * Reserves an ip address.
 * @param {string} ip
 * @returns {Promise}
 */
multicastSchema.statics.release = function(ip) {
    return this
        .findOneAndUpdate(
            {active: true, ip},
            {project: null, active: false},
            {new: true}
        )
        .exec()
        .then(multicast => {
            if (!multicast)
                throw new Error('Could not find record');

            return multicast.ip;
        });
}


module.exports = mongoose.model('Multicast', multicastSchema);
