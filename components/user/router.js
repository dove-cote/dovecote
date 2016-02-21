'use strict';

const async = require('async-q');
const _ = require('lodash');
const express = require('express');
const passport = require('passport');
const validator = require('validator');
const router = express.Router();

const demoProjects = require('dovecote/scripts/demos');
const ProjectService = require('dovecote/components/project/service');

const User = require('dovecote/components/user/model');
const auth = require('dovecote/lib/middlewares/auth');


router.post('/login', passport.authenticate('local'), function(req, res, next) {
    res.json(req.user.toSafeJSON());

    // Update last login date
    req.user.lastLoginDate = new Date();
    req.user.save();
});


router.get('/logout', auth.ensureAuthentication, function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/me', auth.ensureAuthentication, function(req, res, next) {
    res.json(req.user.toSafeJSON());
});


router.post('/register', function(req, res, next) {
    const rawUser = {
        username: req.body.username,
        email: req.body.email
    };

    // Validation stuff
    if (!_.isString(rawUser.username) || rawUser.username.trim().length == 0)
        return next(new Error('Invalid or missing username'));

    if (!_.isString(rawUser.email) || !validator.isEmail(rawUser.email))
        return next(new Error('Invalid or missing email'));

    if (!_.isString(req.body.password) || req.body.password.trim().length == 0)
        return next(new Error('Invalid or missing password'));

    const user = new User(rawUser);
    user.setPassword(req.body.password);

    // Check whether email or username is taken
    User.findOne({
        $or: [
            { email: user.email },
            { username: user.username }
        ]
    }, (err, matchedUser) => {
        if (err) return next(err);
        if (matchedUser) return next(new Error('This username or email is already registered'));

        user.save((err, user_) => {
            if (err) return next(err);

            /**
             * Create demo projects
             */
            return async
                .eachSeries(demoProjects, project => createProject(project, user))
                .then(() => {
                    res.json(user_.toSafeJSON());
                });
        });
    })
});


/**
 * Create project
 * @param {Object} project
 * @returns {Promise}
 */
function createProject(raw, user) {
    return ProjectService
        .create({
            name: raw.name,
            owner: user._id
        })
        .then(project => ProjectService.save(project._id, raw.project));
}


module.exports = router;
