'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Multicast = require('dovecote/components/multicast/model');


/**
 * Creates an ip record for an ip address.
 * @param {String} ip
 * @param {string=} opt_projectId
 * @returns {Promise}
 */
module.exports.create = function(ip, opt_projectId) {
    const raw = {ip};

    if (opt_projectId) {
        raw.active = true;
        raw.project = opt_projectId;
    }

    const multicast = new Multicast(raw);

    return multicast.save();
};


/**
 * Reserves the next available ip address to a project.
 * @param {string|ObjectId} projectId
 * @returns {Promise}
 */
module.exports.reserve = function(projectId) {
    if (!(projectId instanceof ObjectId))
        projectId = new ObjectId(projectId);

    return Multicast.reserve(projectId);
};
