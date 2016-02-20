'use strict';

const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ServiceGenerator = require('dovecote/components/project/generator/service');
const CommonGenerator = require('dovecote/components/project/generator/common');


class ProjectGenerator {
    constructor(projectData, opt_options) {
        this.data = projectData;

        this.options = _.assign({
            targetFolder: `../preserved/generated/${this.data.owner.username}-${this.data.name}-${new Date().getTime()}`
        }, opt_options || {});
    }


    run() {
        return this
            .createTargetFolder()
            .then(() => Promise.all([
                this.generateCommonFiles(),
                this.generateServices()
            ]))
            .then(() => this.generateSockendServiceIfNeeded());
    }


    createTargetFolder() {
        return new Promise((resolve, reject) => {
            mkdirp(this.options.targetFolder + '/services', (err) => {
                if (err) return reject(err);
                resolve();
            });
        })
    }


    generateCommonFiles() {
        const generator = new CommonGenerator(this.data, this.options);
        return generator.run();
    }


    generateServices() {
        const jobs = this.data.services.map((service) => {
            const generator = new ServiceGenerator(service, this.data.multicastIP_, this.options);
            return generator.run();
        });

        return Promise.all(jobs);
    }


    generateSockendServiceIfNeeded() {
        const components = _.flatten(this.data.services.map(service => service.components));
        const exists = !!_.find(components, component => component.type == 'sockend');

        if (!exists) return Promise.resolve();

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
            fs.writeFile(path, content, (err) => {
                if (err) return reject(err);
                resolve();
            })
        });
    }


    writeSockendPM2() {
        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/${_.kebabCase(this.data.name)}.json`;
            const config = require(path);

            config.apps.push({
                name: `${this.data.name}-sockend`,
                script: `services/sockend.js`,
                watch: true
            });

            fs.writeFile(path, JSON.stringify(config, null, 4), (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = ProjectGenerator;
