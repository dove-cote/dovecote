'use strict';

const _ = require('lodash');
const async = require('async-q');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Project = require('dovecote/components/project/model');
const ServiceService = require('dovecote/components/service/service');
const APIError = require('dovecote/lib/apierror');


/**
 * Creates a project.
 * @param {{name}} rawProject
 * @returns {Promise}
 */
module.exports.create = function(rawProject) {
    if (!_.isObject(rawProject))
        return Promise.reject(new APIError('project must be an object', 400));

    const project = new Project(_.pick(rawProject, ['name', 'owner']));
    return project.save();
};


/**
 * Get project with subdocuments
 * @param {string|ObjectId} projectId
 * @returns {Promise}
 */
const get = function(projectId, ownerId) {
    return Project
        .findOne({owner: ownerId, _id: projectId})
        .populate({
            path: 'owner',
            select: '_id username email'
        })
        .populate('services')
        .deepPopulate('services.components')
        .exec();
};
module.exports.get = get;

/**
 * Save project
 * @param {string} id
 * @param {Object} project
 * @returns {Promise}
 */
module.exports.save = function(projectId, rawProject) {
    if (!_.isObject(rawProject))
        return Promise.reject(new APIError('project must be an object', 400));

    const rawServices = rawProject.services;
    if (!_.isArray(rawServices))
        return Promise.reject(new APIError('project.services must be an array', 400));

    return async
        .eachSeries(rawServices, service => ServiceService.upsert(service, projectId))
        .then(services => {
            const updateData = _.pick(rawProject, ['name']);
            updateData.services = _.map(services, service => service._id);

            return Project
                .findOneAndUpdate(
                    {_id: projectId},
                    updateData,
                    {upsert: false, new: true}
                )
                .exec();
        });
};
