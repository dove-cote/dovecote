'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug')('dovecote:components:component:service');
const Component = require('dovecote/components/component/model');
const APIError = require('dovecote/lib/apierror');


/**
 * Upsert a component.
 *     if id is provided, updates the document otherwise creates a new component.
 * @param {Object} component
 * @returns {Promise}
 */
module.exports.upsert = function(component, serviceKey) {
    if (!_.isObject(component))
        return Promise.reject(new APIError('component must be an object', 400));

    debug(`Upserting component...`);

    const updateData = _.pick(component, ['name', 'type', 'namespace', 'external', 'key']);

    if (updateData.name)
        updateData.uniqueKey = serviceKey + '/' + updateData.name;

    if (component._id) {
        let componentId = component._id;

        if (!(componentId instanceof ObjectId))
            componentId = new ObjectId(componentId);

        debug(`Component has already id (${componentId}), updating it...`);

        return Component
            .findOneAndUpdate(
                {_id: componentId},
                updateData,
                {upsert: false, new: true}
            )
            .exec();
    } else {
        debug(`Creating component...`);
        const newComponent = new Component(updateData);
        return newComponent.save();
    }
};
