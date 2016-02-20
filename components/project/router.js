'use strict';

const express = require('express');
const router = express.Router();
const Project = require('dovecote/components/project/model');
const Component = require('dovecote/components/component/model');
const auth = require('dovecote/lib/middlewares/auth');


router.get('/', auth.ensureAuthentication, function(req, res, next) {
    Project
        .find({owner: req.user._id})
        .select('_id name updatedAt createdAt')
        .exec((err, projects) => {
            if (err)
                return res.status(500).end();

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
                return res.status(500).end();

            if (!project)
                return res.status(404).end();

            res.json(project);
        })
});


module.exports = router;
