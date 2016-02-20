'use strict';

const _ = require('lodash');
const debug = require('debug')('dovecote:fixture');
const async = require('async-q');
const mongo = require('dovecote/lib/mongo');
const Multicast = require('dovecote/components/multicast/model');
const MulticastService = require('dovecote/components/multicast/service');
const User = require('dovecote/components/user/model');
const Project = require('dovecote/components/project/model');
const Service = require('dovecote/components/service/model');
const Component = require('dovecote/components/component/model');
const ProjectService = require('dovecote/components/project/service');

const resetDB = !!~process.argv.indexOf('--reset');

/**
 * Removes all collections.
 * @returns {Promise}
 */
function reset() {
    return User
        .remove()
        .then(() => Multicast.remove())
        .then(() => Service.remove())
        .then(() => Component.remove())
        .then(() => Project.remove());
}

/**
 * Fills ip records.
 * @returns {Promise}
 */
function multicastFixtures() {
    debug(`Multicast Fixtures`);
    const ip = [239, 1, 0, 0];
    const ipList = [];
    while (ip[2] <= 255) {
        ip[3] = 0;
        while (ip[3] < 255) {
            ip[3]++;
            ipList.push(ip.join('.'));
        }
        ip[2]++;
    }
    debug(`Adding ${ipList.length} ip records (this may take some ~3mins, be patient)`);
    return async.eachLimit(ipList, 30, ip => {
        return MulticastService.create(ip);
    });
}

const demoProjects = require('./demos');

/**
 * Adds test user
 * @returns {Promise}
 */
function userFixture() {
    const user = new User({
        username: 'test',
        email: 'test@dove-cote.co'
    });

    user.setPassword('asdf123');
    debug(`Creating user ${user.username}`);
    return user.save();
}


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


Promise
    .resolve()
    .then(() => {
        if (resetDB) return reset();
    })
    .then(() => multicastFixtures())
    .then(() => userFixture())
    .then(user => async.eachSeries(demoProjects, project => createProject(project, user)))
    .then(project => {
        debug('Fixture data created');
        process.exit()
    })
    .catch(err => console.log('Error when creating fixture data', err));
