'use strict';

const _ = require('lodash');
const async = require('async-q');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Service = require('dovecote/components/service/model');
const ComponentService = require('dovecote/components/component/service');
const APIError = require('dovecote/lib/apierror');


/**
 * Upsert a service.
 *     if id is provided, updates the document otherwise creates a new service.
 * @param {Object} service
 * @returns {Promise}
 */
module.exports.upsert = function(service, projectId) {
    if (!_.isObject(service))
        return Promise.reject(new APIError('service must be an object', 400));

    if (!_.isArray(service.components))
        return Promise.reject(new APIError('service.components must be an array', 400));

    const updateData = _.pick(service, ['name', 'instance', 'code', 'meta', 'key']);
    const serviceKey = projectId + '/' + updateData.name;
    if (updateData.name)
        updateData.uniqueKey = serviceKey;

    return async
        .eachSeries(service.components, component => ComponentService.upsert(component, serviceKey))
        .then(components => {
            updateData.components = _.map(components, component => component._id);

            if (service._id) {
                let serviceId = service._id;

                if (!(serviceId instanceof ObjectId))
                    serviceId = new ObjectId(serviceId);

                return Service
                    .findOneAndUpdate(
                        {_id: serviceId},
                        updateData,
                        {upsert: false, new: true}
                    )
                    .exec();
            } else {
                const newservice = new Service(updateData);
                return newservice.save();
            }
        })

};
