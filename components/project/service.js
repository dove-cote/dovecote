'use strict';

const _ = require('lodash');
const async = require('async-q');
const path = require('path');
const debug = require('debug')('dovecote:components:project:service');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Project = require('dovecote/components/project/model');
const MulticastService = require('dovecote/components/multicast/service');
const ServiceService = require('dovecote/components/service/service');
const APIError = require('dovecote/lib/apierror');
const ProjectGenerator = require('dovecote/components/project/generator');
const DockerService = require('dovecote/components/docker/service');
const SockendDemoGenerator = require('dovecote/components/project/generator/sockenddemo')



/**
 * Creates a project.
 * @param {{name}} rawProject
 * @returns {Promise}
 */
module.exports.create = function(rawProject) {
    if (!_.isObject(rawProject))
        return Promise.reject(new APIError('project must be an object', 400));

    const project = new Project(_.pick(rawProject, ['name', 'owner']));
    return project.
        save().
        then(project => {
            return ServiceService.upsert({
                name: 'Gateway',
                meta: {position: {x: 10, y: 10}},
                components: [
                    {
                        name: 'Gateway',
                        type: 'sockend'
                    }
                ]}, project._id).
                then(service => {
                    project.services.push(service._id);
                    return project.save();
                });
        }).
        then(project => get(project._id, project.owner));
};


/**
 * Get project with subdocuments
 * @param {string|ObjectId} projectId
 * @returns {Promise}
 */
const get = function(projectId, ownerId) {
    return Project.
        findOne({owner: ownerId, _id: projectId}).
        populate({
            path: 'owner',
            select: '_id username email'
        }).
        populate('services').
        deepPopulate('services.components').
        exec();
};
module.exports.get = get;


/**
 * List projects by userId
 * @param {string} ownerId
 */
const list = function(ownerId) {
    return Project.
        find({owner: ownerId}).
        select('_id name updatedAt createdAt').
        sort({updatedAt: -1}).
        exec();
}
module.exports.list = list;


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

    return async.
        eachSeries(rawServices, service => ServiceService.upsert(service, projectId)).
        then(services => {
            const updateData = _.pick(rawProject, ['name']);
            updateData.services = _.map(services, service => service._id);

            return Project.
                findOneAndUpdate(
                    {_id: projectId},
                    updateData,
                    {upsert: false, new: true}
                ).
                exec();
        });
};


/**
 * Stops a project
 * @param {Object} project
 * @returns {Promise}
 */
function stopProject(project) {
    debug(`Terminating project ${project._id}`);
    const containerId = project.deploy && project.deploy.container && project.deploy.container.id;
    return DockerService.
        terminate(containerId).
        catch((err) => {
            console.log(`Could not terminate docker container`, project, err);
        }).
        then(() => {
            debug(`Setting ${project._id}'s state as "terminated"`);

            return MulticastService.
                release(project.multicastIP_)
                .catch(err => {
                    console.log('Multicast record could not found.');
                });
                then(() => {
                    project.state = 'terminated';
                    project.deploy = undefined;
                    project.multicastIP_ = undefined;
                    return project.save();
                });
        });
}


/**
 * Stop all projects by ownerId
 * @param {string|ObjectId} ownerId
 * @returns {Promise}
 */
function stopAllProjects(ownerId) {
    debug(`Listing all projects of ${ownerId}`);
    let projects = null;
    return Project.
        find({owner: ownerId, state: 'running'}).
        populate('services').
        exec().
        then(projects_ => {
            projects = projects_;
            return async.eachSeries(projects, stopProject);
        }).
        then(() => {
            debug(`${projects.length} projects of ${ownerId} have terminated.`);
        });
}


/**
 * Deploys a project
 * @param {string|ObjectId} id
 * @returns {Promise}
 */
module.exports.deploy = function(projectId, ownerId) {
    let project = null;
    debug(`Deploying project ${projectId}`);
    return stopAllProjects(ownerId).
        then(() => get(projectId, ownerId)).
        then(project_ => {
            project = project_;
            if (!project)
                throw new APIError(`Project with id ${req.params.projectId} is not defined`, 404);

            return MulticastService.
                reserve(project._id).
                then(ip => {
                    project.multicastIP_ = ip;
                    return project.save();
                }).
                then(() => {
                    const generator = new ProjectGenerator(project);
                    return generator.run();
                }).
                then(response => {
                    const sourceDir = path.resolve(process.cwd(), response.deployFolder);
                    return DockerService.
                        run(sourceDir, ownerId, project._id).
                        then(container => {
                            project.deploy = {
                                deployFolder: response.deployFolder,
                                services: response.services,
                                container: container
                            }
                            project.state = 'running';
                            return project.save();
                        });
                }).
                then(() => {
                    const generator = new SockendDemoGenerator(project.deploy);
                    return generator.run();
                }).
                then(() => get(projectId, ownerId));
        });
};
