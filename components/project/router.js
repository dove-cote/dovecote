'use strict';

const async = require('async-q');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Project = require('dovecote/components/project/model');
const Component = require('dovecote/components/component/model');
const auth = require('dovecote/lib/middlewares/auth');
const APIError = require('dovecote/lib/apierror');
const ProjectService = require('dovecote/components/project/service');
const MonitorRecord = require('dovecote/components/monitorrecord/model');
const DockerService = require('dovecote/components/docker/service');



router.get('/', auth.ensureAuthentication, function(req, res, next) {
    ProjectService
        .list(req.user._id)
        .then(projects => res.json(projects))
        .catch(next);
});


router.get('/:projectId', auth.ensureAuthentication, function(req, res, next) {
    ProjectService
        .get(req.params.projectId, req.user._id)
        .then(project => {
            if (!project)
                return next(new APIError(`Project with id ${req.params.projectId} is not defined`, 404));

            res.json(project);
        })
        .catch(next);
});


router.post('/', auth.ensureAuthentication, function(req, res, next) {
    const rawProject = req.body.project;
    ProjectService
        .create(_.assign(rawProject, {owner: req.user._id}))
        .then(project => res.json(project))
        .catch(next);
});


router.put('/:projectId', auth.ensureAuthentication, function(req, res, next) {
    const projectId = req.params.projectId;
    ProjectService
        .save(projectId, req.body.project)
        .then(project => {
            return Project
                .findOne({_id: projectId})
                .populate({
                    path: 'owner',
                    select: '_id username email'
                })
                .populate('services')
                .deepPopulate('services.components')
                .exec((err, project) => {
                    if (err)
                        throw new APIError(`Could not get project with id ${projectId}`, 500);

                    if (!project)
                        throw new APIError(`Project with id ${projectId} is not defined`, 404);

                    res.json(project);
                })
        })
        .catch(next);
});



router.post('/:projectId/deploy', auth.ensureAuthentication, function(req, res, next) {
    ProjectService
        .deploy(req.params.projectId, req.user._id)
        .then(project => res.json(project))
        .catch(next);
});



router.get('/:projectId/status', auth.ensureAuthentication, function(req, res, next) {
    // TODO: Add owner check
    MonitorRecord
        .findOne({project: req.params.projectId})
        .exec()
        .then(monitorRecord => {
            if (!monitorRecord) return res.status(404).end();
            res.json(monitorRecord);
        })
        .catch(next);
});



router.get('/:projectId/logs', auth.ensureAuthentication, function(req, res, next) {
    Project
        .findOne({_id: req.params.projectId})
        .exec()
        .then(project => {
            if (!project)
                return next(new APIError('Project not found', 400));

            if ((project.owner+'') != (''+req.user._id))
                return next(new APIError('This is not your project', 401));

            if (project.state != 'running')
                return next(new APIError('Project is not running.', 400));

            if (!_.isObject(project.deploy) || !_.isObject(project.deploy.container) || !project.deploy.container.id)
                return next(new APIError('Opps something is wrong, please try again.', 500));

            return DockerService
                .logs(project.deploy.container.id)
                .then(logs => res.send(logs))
                .catch(next);

        })
});


module.exports = router;
