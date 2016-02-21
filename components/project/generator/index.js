'use strict';

const _ = require('lodash');
const fs = require('fs');
const exec = require('child_process').exec;
const mkdirp = require('mkdirp');
const debug = require('debug')('dovecote:components:project:generator');
const ServiceGenerator = require('dovecote/components/project/generator/service');
const CommonGenerator = require('dovecote/components/project/generator/common');


class ProjectGenerator {
    constructor(projectData, opt_options) {
        this.data = projectData;

        this.options = _.assign({
            targetFolder: `../preserved/generated/${this.data.owner.username}-${this.data.name}-${new Date().getTime()}`
        }, opt_options || {});
    }


    createReport() {
        const services = this.data.services.map((service) => {
            const kebabCasedName = _.kebabCase(service.name);
            return {
                name: `${this.data.owner._id}-${this.data.name}-${kebabCasedName}`,
                script: `services/${kebabCasedName}.js`,
                instance: service.instance || 1,
                cwd: this.options.targetFolder
            };
        });

        if (this.hasSockend_) {
            services.push({
                name: `${this.data.owner._id}-${this.data.name}-sockend`,
                script: `services/sockend.js`,
                instance: service.instance || 1,
                cwd: this.options.targetFolder
            });
        }
        return {
            deployFolder: this.options.targetFolder,
            name: this.data.name,
            owner: this.data.owner,
            services
        };
    }


    run() {
        debug(`Start generating ${this.data.name}...`);
        return this.
            createTargetFolder().
            then(() => this.generateServices()).
            then(() => this.generateCommonFiles()).
            then(() => this.generateSockendServiceIfNeeded()).
            then(() => this.runNpmInstall()).
            then(() => this.createReport());
    }


    createTargetFolder() {
        return new Promise((resolve, reject) => {
            mkdirp(this.options.targetFolder + '/services', (err) => {
                if (err) {
                    debug(`Cannot create target folder: ${this.options.targetFolder}`);
                    return reject(err);
                }

                debug(`Created target folder: ${this.options.targetFolder}`);
                resolve();
            });
        })
    }


    generateCommonFiles() {
        debug(`Generating common files...`);
        const requiredModules = this.getRequiredModules();
        const generator = new CommonGenerator(this.data, this.options, requiredModules);
        return generator.run();
    }


    generateServices() {
        debug(`Generating services...`);
        this.serviceGenerators = this.data.services.map((service) => {
            return new ServiceGenerator(service, this.data.multicastIP_, this.options);
        });

        return Promise.all(this.serviceGenerators.map(gen => gen.run()));
    }


    generateSockendServiceIfNeeded() {
        debug(`Checking sockend service...`);
        const components = _.flatten(this.data.services.map(service => service.components));
        this.hasSockend_ = !!_.find(components, component => component.type == 'sockend');

        if (!this.hasSockend_) {
            debug(`Does not have sockend, skipping...`);
            return Promise.resolve();
        }

        return Promise.all([
            this.writeSockendService(),
            this.writeSockendPM2()
        ]);
    }


    writeSockendService() {
        const content = `
            var cote = require('cote', {multicast: '${this.data.multicastIP_}'});
            var http = require('http');
            var fs = require('fs');
            var socketIO = require('socket.io');


            function handler(req, res) {
                fs.readFile(__dirname + '/../index.html', function(err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading index.html');
                    }

                    res.writeHead(200);
                    res.end(data);
                });
            }

            app = http.createServer(handler);
            app.listen(process.argv[2] || 5555);

            io = socketIO.listen(app);

            new cote.Sockend(io, {
                name: 'sockend'
            });
        `;

        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/services/sockend.js`;
            debug(`Creating sockend service: ${path}`);

            fs.writeFile(path, content, (err) => {
                if (err) {
                    debug(`Cannot create sockend service: ${path}`, err);
                    return reject(err);
                }

                debug(`Created sockend service: ${path}`);
                resolve();
            })
        });
    }


    writeSockendPM2() {
        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/${_.kebabCase(this.data.name)}.json`;
            const config = require(path);
            debug(`Updating pm2 configuration for sockend: ${path}`);

            config.apps.push({
                name: `${this.data.owner._id}-${this.data.name}-sockend`,
                script: `services/sockend.js`,
                watch: true
            });

            fs.writeFile(path, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    debug(`Could not pm2 config: ${path}`, err);
                    return reject(err);
                }

                debug(`Updated pm2 configuration for sockend: ${path}`);
                resolve();
            });
        });
    }


    getRequiredModules() {
        let modulesObj = {};

        this.serviceGenerators.forEach((generator) => {
            modulesObj = _.assign(modulesObj, generator.parseResults.requiredModules);
        });

        return _.keys(modulesObj);
    }


    runNpmInstall() {
        debug('Try to run npm install, will check required modules first...');
        return new Promise((resolve ,reject) => {
            const cmd = `npm install`;
            debug(`Executing ${cmd}`);

            exec(cmd, { cwd: this.options.targetFolder }, (err) => {
                if (err) {
                    debug(`Could not execute npm install`, err);
                    return reject(err);
                }

                debug(`Executed npm install`);
                resolve();
            });
        });
    }
}

module.exports = ProjectGenerator;
