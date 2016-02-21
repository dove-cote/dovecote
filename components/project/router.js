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


router.get('/', auth.ensureAuthentication, function(req, res, next) {
    Project
        .find({owner: req.user._id})
        .select('_id name updatedAt createdAt')
        .sort({updatedAt: -1})
        .exec((err, projects) => {
            if (err)
                return next(new APIError(`Could not get project list`, 500));

            res.json(projects);
        })
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
            console.log('project created', project);
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
        .then(() => res.status(200).end())
        .catch(next);
});


module.exports = router;
