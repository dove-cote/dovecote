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

    console.log("before logout");

    req.logout();
    console.log("after logout");

    res.redirect('/');
});


router.get('/me', auth.ensureAuthentication, function(req, res, next) {
    res.json(req.user.toSafeJSON());
});


router.post('/register', function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(new Error(`You've been already registered!`));
    }

    const isAnonymous = _.keys(req.query).indexOf('anonymous') > -1;

    if (isAnonymous) {
        const randomStr = Math.random().toString(36).substring(2, 8);
        const username = `anonymous-${randomStr}`;
        req.body.username = username;
        req.body.email = `${username}@dove-cote.co`;
        req.body.password = Math.random().toString(36).substring(2, 16);
    }

    const rawUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    // Validation stuff
    if (!_.isString(rawUser.username) || rawUser.username.trim().length == 0)
        return next(new Error('Invalid or missing username'));

    if (!_.isString(rawUser.email) || !validator.isEmail(rawUser.email))
        return next(new Error('Invalid or missing email'));

    if (!_.isString(rawUser.password) || rawUser.password.trim().length == 0)
        return next(new Error('Invalid or missing password'));

    const user = new User(rawUser);
    user.setPassword(rawUser.password);

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
            return async.
                eachSeries(demoProjects, project => createProject(project, user_)).
                then(() => {
                    const authenticate = passport.authenticate('local');
                    authenticate(req, res, () => res.json(user_.toSafeJSON()));
                }).
                catch(next);
        });
    })
});


/**
 * Create project
 * @param {Object} project
 * @returns {Promise}
 */
function createProject(raw, user) {
    raw = _.cloneDeep(raw);
    return ProjectService.
        create({
            name: raw.name,
            owner: user._id
        }).
        then((project) => {
            const gatewayService = _.find(project.services, service => service.name == 'Gateway');
            if (gatewayService) raw.project.services.push(gatewayService);
            return ProjectService.save(project._id, raw.project);
        });
}


module.exports = router;
