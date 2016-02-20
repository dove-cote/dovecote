'use strict';

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
 * @param {string} projectId
 * @returns {Promise}
 */
module.exports.reserve = function(projectId) {
    Multicast
        .findOne({active: false})
        .exec()
        .then(multicast => {
            if (!multicast)
                throw new Error('Could not find an available ip address');

            multicast.project = projectId;
            multicast.active = true;

            return multicast.save();
        });
};
