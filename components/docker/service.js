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
            host: '192.168.99.100',
            port: 2376
        };

        if (process.env.DOCKER_CERT_DIR) {
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
        this.docker
            .listContainers()
            .then(containers => {
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

        if (!container) {
            debug('Container id not found');
            return Promise.resolve();
        }

        debug(`Container with id ${containerId} was found`);
        debug(`Stopiing container...`);

        return container
            .stop()
            .then(() => {
                debug(`Deleting container ${containerId}`);
                return container.remove();
            });
    }


    /**
     * Run a new container with source directory and ownerId.
     * @param {string} sourceDir
     * @param {string} ownerId
     * @returns {Promise}
     */
    run(sourceDir, ownerId) {
        const nodeVersion = process.env.DOCKER_NODE_VERSION || '4.2.2'

        debug(`Creating docker container from ${sourceDir}`);
        return this.docker
            .createContainer({
                Image: `mertdogar/node-pm2:${nodeVersion}`,
                Env: [
                    'APP=pm2.json'
                ]
            })
            .then(container => {
                const containerId = container.$subject.id;
                debug(`Container created id=${containerId}.`);
                return container
                    .start({
                        Binds: [`${sourceDir}:/app`],
                        PublishAllPorts: true,
                    })
                    .then(response2 => {
                        return container.inspect()
                            .then(data => {
                                const port = data.NetworkSettings.Ports['80/tcp'][0].HostPort;
                                const containerIP = data.NetworkSettings.IPAddress;
                                const state = data.State;
                                return {
                                    id: containerId,
                                    state,
                                    containerIP,
                                    port
                                };
                            })

                    });
            });
    }
}


module.exports = new DockerService();
