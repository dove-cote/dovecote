'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Project = require('dovecote/components/project/model');
const APIError = require('dovecote/lib/apierror');


/**
 * Save project.

 * @param {Object} component
 * @returns {Promise}
 */
module.exports.save = function(id, component) {
    if (!_.isObject(component))
        return Promise.reject(new APIError('component must be an object', 400));

    const updateData = _.pick(component, ['name', 'type', 'namespace', 'external']);
    if (component._id) {
        let componentId = component._id;

        if (!(componentId instanceof ObjectId))
            componentId = new ObjectId(componentId);


        return Component
            .findOneAndUpdate(
                {_id: componentId},
                updateData,
                {upsert: false, new: true}
            )
            .exec();
    } else {
        const newComponent = new Component(updateData);
        return newComponent.save();
    }
};
