'use strict';

const _ = require('lodash');
const async = require('async-q');
const debug = require('debug')('dovecote:components:docker:service');
const APIError = require('dovecote/lib/apierror');
const fs = require('fs');
const randomr = require('randomr');
const Docker = require('dockerode-promise');
const stream = require('stream');



class DockerService {
    constructor() {
        let options = {
            socketPath: '/var/run/docker.sock'
        };

        if (process.env.DOCKER_CERT_DIR) {
            options = {
                host: process.env.DOCKER_HOST,
                port: 2376
            };

            options = _.assign(options, {
                ca: fs.readFileSync(`${process.env.DOCKER_CERT_DIR}/ca.pem`),
                cert: fs.readFileSync(`${process.env.DOCKER_CERT_DIR}/cert.pem`),
                key: fs.readFileSync(`${process.env.DOCKER_CERT_DIR}/key.pem`)
            });
        }

        this.docker = new Docker(options);

        this.period = 15000; //in msec
        this.maxUptime = 30; //in sec
        setTimeout(() => this.list(), this.period);
    }


    /**
     * List existing containers.
     * @returns {Promise}
     */
    list() {
        return this.docker.
            listContainers().
            then(containers => async.mapSeries(containers, container => this.docker.getContainer(container.Id).inspect())).
            then(containers => {
                const now = Date.now();

                const toBeClosed = _.filter(containers, container => {
                    const image = container.Config.Image;
                    if (image.indexOf('mertdogar/node-pm2') == -1)
                        return;

                    const uptimeInSec = Math.floor((now - new Date(container.State.StartedAt).getTime()) / 1000);
                    return uptimeInSec > 60 * this.maxUptime;
                });

                if (!toBeClosed.length)
                    return;

                console.log(`There are ${toBeClosed.length} old containers, terminating...`);

                const containerIds = _.map(toBeClosed, container => container.Id);
                return async
                    .eachSeries(containerIds, id => this.terminate(id))
                    .then(() => {
                        console.log('terminated');
                    });
            }).
            catch(err => console.log('Err at docker timer', err)).
            then(() => {
                setTimeout(() => this.list(), this.period);
            });
    }


    /**
     * Gets last 100lines of log.
     * @param {string} containerId
     * @returns {Promise}
     */
    logs(containerId) {
        return new Promise((resolve, reject) => {
            let logs = '';
            const container = this.docker.getContainer(containerId);
            const logStream = new stream.PassThrough();
            logStream.on('data', function(chunk) {
                logs = logs + chunk;
            });
            logStream.on('end', function() {
                resolve(logs);
            });

            container.logs({
                follow: false,
                stdout: true,
                stderr: true,
                tail: 100
            }, function(err, stream) {
                if (err) {
                    console.log(`Could not get logs of ${containerId}`)
                    return reject(new APIError(`Could not get logs of ${containerId}`, 500));
                }

                container.modem.demuxStream(stream, logStream, logStream);

                stream.on('end', function() {
                    logStream.end('!stop!');
                });
            });
        });
    }


    /**
     * Terminate a container by id.
     * @param {string} containerId
     * @returns {Promise}
     */
    terminate(containerId) {
        if (!_.isString(containerId))
            return Promise.resolve();

        const container = this.docker.getContainer(containerId);

        return container.inspect().
            then(data => {
                const port = data.NetworkSettings.Ports['80/tcp'][0].HostPort;
                const containerIP = data.NetworkSettings.IPAddress;
                const state = data.State;

                if (!state.Running) return;

                debug(`Container with id ${containerId} was found`);
                debug(`Stopiing container...`);

                return container.
                    stop().
                    then(() => {
                        debug(`Deleting container ${containerId}`);
                        return container.remove();
                    });
            });
    }


    /**
     * Run a new container with source directory and ownerId.
     * @param {string} sourceDir
     * @param {string} ownerId
     * @param {string} projectId
     * @returns {Promise}
     */
    run(sourceDir, ownerId, projectId) {
        const nodeVersion = process.env.DOCKER_NODE_VERSION || '4.2.2'

        debug(`Creating docker container from ${sourceDir}`);
        const mongoUrl = process.env.DOVECOTE_MONGO || 'mongodb://mongo/dovecote';
        return this.docker.
            createContainer({
                Image: `mertdogar/node-pm2:${nodeVersion}`,
                Env: [
                    `APP=pm2.json`,
                    `DOVECOTE_USER=${ownerId}`,
                    `DOVECOTE_PROJECT=${projectId}`,
                    `DOVECOTE_MONGO=${mongoUrl}`
                ]
            }).
            then(container => {
                const containerId = container.$subject.id;
                debug(`Container created id=${containerId}.`);

                var pathPrefix = process.env.SOURCE_DIR_PREFIX ? process.env.SOURCE_DIR_PREFIX : '';

                const startOptions = {
                    Binds: [`${pathPrefix}${sourceDir}:/app`],
                    PublishAllPorts: true
                };

                if (process.env.DOCKER_CERT_DIR || process.env.DOCKER_MONGO_LINK)
                    startOptions.Links = [process.env.DOCKER_MONGO_LINK || `mongo:mongo`];

                return container.
                    start(startOptions).
                    then(response2 => {
                        return container.inspect().
                            then(data => {
                                const port = data.NetworkSettings.Ports['80/tcp'][0].HostPort;
                                const containerIP = data.NetworkSettings.IPAddress;
                                const state = data.State;
                                return {
                                    id: containerId,
                                    state,
                                    containerIP,
                                    port,
                                    host: process.env.DEPLOY_HOST || 'localhost'
                                };
                            })

                    });
            });
    }
}


module.exports = new DockerService();
