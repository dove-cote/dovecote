'use strict';

const _ = require('lodash');
const async = require('async-q');
const debug = require('debug')('dovecote:components:docker:service');
const APIError = require('dovecote/lib/apierror');
const fs = require('fs');
const randomr = require('randomr');
const Docker = require('dockerode-promise');


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
    }


    /**
     * List existing containers.
     * @returns {Promise}
     */
    list() {
        this.docker.
            listContainers().
            then(containers => {
                containers.forEach(containerInfo => {
                    this.docker
                        .getContainer(containerInfo.Id)
                        .inspect()
                        .then(data => {
                            console.log(data);
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
        return this.docker.
            createContainer({
                Image: `mertdogar/node-pm2:${nodeVersion}`,
                Env: [
                    `APP=pm2.json`,
                    `DOVECOTE_USER=${ownerId}`,
                    `DOVECOTE_PROJECT=${projectId}`
                ]
            }).
            then(container => {
                const containerId = container.$subject.id;
                debug(`Container created id=${containerId}.`);

                const startOptions = {
                    Binds: [`${sourceDir}:/app`],
                    PublishAllPorts: true
                };

                if (process.env.DOCKER_CERT_DIR)
                    startOptions.Links = [`mongo:mongo`];

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
