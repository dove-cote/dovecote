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
const ServiceService = require('dovecote/components/service/service');


router.get('/', auth.ensureAuthentication, function(req, res, next) {
    Project
        .find({owner: req.user._id})
        .select('_id name updatedAt createdAt')
        .exec((err, projects) => {
            if (err)
                return next(new APIError(`Could not get project list`, 500));

            res.json(projects);
        })
});


router.get('/:projectId', auth.ensureAuthentication, function(req, res, next) {
    Project
        .findOne({owner: req.user._id, _id: req.params.projectId})
        .populate({
            path: 'owner',
            select: '_id username email'
        })
        .populate('services')
        .deepPopulate('services.components')
        .exec((err, project) => {
            if (err)
                return next(new APIError(`Could not get project with id ${req.params.projectId}`, 500));

            if (!project)
                return next(new APIError(`Project with id ${req.params.projectId} is not defined`, 404));

            res.json(project);
        })
});


router.post('/', auth.ensureAuthentication, function(req, res, next) {
    const rawProject = req.body.project;
    if (!_.isObject(rawProject))
        return next(new APIError('project must be an object', 400));

    const raw = _.pick(rawProject, ['name']);
    raw.owner = req.user._id;

    const project = new Project(raw);
    project
        .save()
        .then(project => res.json(project))
        .catch(next);
});


router.put('/:projectId', auth.ensureAuthentication, function(req, res, next) {
    const projectId = new ObjectId(req.params.projectId);
    const rawProject = req.body.project;
    if (!_.isObject(rawProject))
        return next(new APIError('project must be an object', 400));

    const rawServices = rawProject.services;
    if (!_.isArray(rawServices))
        return next(new APIError('project.services must be an array', 400));

    async
        .eachSeries(rawServices, ServiceService.upsert)
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
        })
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
                        throw new APIError(`Could not get project with id ${req.params.projectId}`, 500);

                    if (!project)
                        throw new APIError(`Project with id ${req.params.projectId} is not defined`, 404);

                    res.json(project);
                })
        })
        .catch(next);
});


module.exports = router;
