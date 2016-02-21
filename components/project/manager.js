'use strict';

const async = require('async-q');
const _ = require('lodash');
const pm2 = require('pm2');
const debug = require('debug')('dovecote:components:project:manager');


class Manager {
    constructor() {
        debug('Connecting pm2');
        this.monitorPeriod = 3000;
        this.connectPromise = new Promise((resolve, reject) => {
            pm2.connect(err => {
                if (err) {
                    debug('Important error! Could not connect to pm2 api');
                    return reject(new Error('Could not connect to pm2'));
                }

                /**
                 * Start monitoring timer
                 */
                setTimeout(() => {
                    this.tick();
                }, this.monitorPeriod)

                resolve();
            });
        })
    }


    /**
     * Invoked periodicaly.
     */
    tick() {
        this
            .listProcesses()
            .then(list => {
                const running = _.filter(list, item => item.status == 'online');
                //_.forEach(running, item => console.log(item));
            })
            .catch(err => {
                console.log('ProjectManagerTick: Error when listing processes', err);
            })
            .then(() => {
                setTimeout(() => this.tick(), this.monitorPeriod);
            });
    }


    /**
     * Gets list of the defined processes.
     * @returns {Promise}
     */
    listProcesses() {
        return new Promise((resolve, reject) => {
            pm2.list((err, list) => {
                if (err)
                    return reject(new Error('Could not get process list from pm2'));
                async
                    .map(list, process_ => this.describe(process_.name))
                    .then(list => {
                        resolve(_.map(list, item => {
                            return {
                                monit: item[0].monit,
                                status: item[0].pm2_env.status,
                                pid: item[0].pid,
                                name: item[0].pm2_env.name,
                                nodeVersion: item[0].pm2_env.node_version,
                                createdAt: item[0].pm2_env.created_at,
                                uptime: Date.now() - item[0].pm2_env.pm_uptime
                            }
                        }));
                    })
                    .catch(reject);
            });
        });
    }


    /**
     * Gets info of a process.
     * @param {string} name
     * @returns {Promise}
     */
    describe(name) {
        return new Promise((resolve, reject) => {
            pm2.describe(name, (err, process_) => {
                if (err)
                    return reject(new Error(`Could not describe project with name ${name}`));

                resolve(process_);
            });
        });
    }


    /**
     * Runs a project json.
     * @param {Object} services
     * @returns {Promise}
     */
    run(services) {
        return new Promise((resolve, reject) => {
            const projectDeclaration = {
                apps: _.map(services, service => {
                    return _.assign(service, {
                        max_memory_restart: '50M'
                    })
                })
            };

            pm2.start(projectDeclaration, (err, apps) => {
                if (err)
                    return reject(new Error(`Could not start project`));

                resolve();
            });
        });
    }


    /**
     * Terminate list of processs.
     * @param {Array.<string>} names
     * @returns {Promise}
     */
    terminateList(names) {
        debug(`Terminating processes: ${names}`);
        return async.eachLimit(names, 10, this.terminate);
    }


    /**
     * Terminates a single process.
     * @param {string} name
     * @returns {Promise}
     */
    terminate(name) {
        return new Promise((resolve, reject) => {
            pm2.stop(name, err => {
                if (err)
                    return reject(new Error(`Could not stop ${name}`));

                pm2.delete(name, err => {
                    if (err)
                        return reject(new Error(`Could not delete ${name}`));
                    resolve();
                })
            })
        })
    }
}


module.exports = new Manager();
