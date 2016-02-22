'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const mkdirp = require('mkdirp');
const debug = require('debug')('dovecote:components:project:generator');
const ncp = require('ncp').ncp;
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
        debug(`Start generating ${this.data.name}...`);
        return Promise.all([
                this.createFolder(this.options.targetFolder),
                this.createFolder(`${this.options.targetFolder}/services`),
                this.createFolder(`${this.options.targetFolder}/node_modules`)
            ]).
            then(() => this.generateServices()).
            then(() => this.generateCommonFiles()).
            then(() => this.generateSockendService()).
            then(() => Promise.all([
                this.copyNodeModule('socket.io'),
                this.copyNodeModule('cote')
            ])).
            then(() => this.runNpmInstall()).
            then(() => this.createReport());
    }


    createFolder(path_) {
        return new Promise((resolve, reject) => {
            mkdirp(path_, (err) => {
                if (err) {
                    debug(`Cannot create folder: ${path_}`);
                    return reject(err);
                }

                debug(`Created folder: ${path_}`);
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


    generateSockendService() {
        debug(`Creating sockend service...`);
        return Promise.all([
            this.writeSockendService(),
            this.writeMonitorService(),
            this.writeSockendPM2()
        ]);
    }

    writeMonitorService() {
        const content = `
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.DOVECOTE_MONGO || 'mongodb://mongo/dovecote');

mongoose.connection.on(
    'error',
    console.error.bind(console, 'Mongo connection error')
);

mongoose.connection.once('open', function() {
    console.log('Connected to mongo');
});


const monitorRecordSchema = new Schema({
    nodes: [{type: Schema.Types.Mixed}],
    links: [{type: Schema.Types.Mixed}],
    project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});


const MonitorRecord = mongoose.model('MonitorRecord', monitorRecordSchema);




var cote = require('cote', {multicast: '239.1.1.1'});
var _ = require('lodash');

var monitor = new cote.Monitor({
    name: 'monitor'
}, {disableScreen: true});

var graph = {
    nodes: [],
    links: []
};

var rawLinks = {};

monitor.on('status', function(status) {
    var node = monitor.discovery.nodes[status.id];
    if (!node) return;

    rawLinks[status.id] = {
        source: status.id,
        target: status.nodes
    };
});

setInterval(function() {
    graph.nodes = _.map(monitor.discovery.nodes, function(node) {
        return {
            id: node.id,
            name: node.advertisement.name
        }
    });

    var indexMap = {};
    graph.nodes.forEach(function(node, index) {
        indexMap[node.id] = index;
    });

    var links = _.map(rawLinks, function(rawLink) {
        return rawLink.target.map(function(target) {
            return { // flip source & target for semantics :)
                source: indexMap[target],//monitor.discovery.nodes[target].advertisement.name + '#' + target,
                target: indexMap[rawLink.source]//monitor.discovery.nodes[rawLink.source].advertisement.name + '#' + rawLink.source
            };
        });
    });

    graph.links = _.flatten(links);
    graph.project = process.env.DOVECOTE_PROJECT;


    MonitorRecord.findOneAndUpdate({project: graph.project}, graph, {upsert: true}).exec();
}, 5000);

        `;

        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/services/___monitor.js`;
            debug(`Creating monitor: ${path}`);

            fs.writeFile(path, content, (err) => {
                if (err) {
                    debug(`Cannot create monitor service: ${path}`, err);
                    return reject(err);
                }

                debug(`Created monitor service: ${path}`);
                resolve();
            })
        });
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
            app.listen(80);

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
            const path_ = path.resolve(process.cwd(), `${this.options.targetFolder}/pm2.json`);
            const config = require(path_);
            debug(`Updating pm2 configuration for sockend: ${path_}`);

            config.apps.push({
                name: `${this.data.owner._id}-${this.data.name}-sockend`,
                script: `services/sockend.js`
            }, {
                name: `${this.data.owner._id}-${this.data.name}-___monitor`,
                script: `services/___monitor.js`
            });

            fs.writeFile(path_, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    debug(`Could not pm2 config: ${path_}`, err);
                    return reject(err);
                }

                debug(`Updated pm2 configuration for sockend: ${path_}`);
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


    createReport() {
        const services = this.data.services.map((service) => {
            const kebabCasedName = _.kebabCase(service.name);
            return {
                name: `${this.data.owner._id}-${this.data.name}-${kebabCasedName}`,
                script: `services/${kebabCasedName}.js`,
                instance: service.instance || 1,
                cwd: this.options.targetFolder,
                key: service.key,
                namespace: service.namespace
            };
        });

        const report = {
            deployFolder: this.options.targetFolder,
            name: this.data.name,
            owner: this.data.owner,
            services
        };

        return report;
    }


    copyNodeModule(moduleName) {
        debug(`Copying node module ${moduleName}...`);
        return new Promise((resolve, reject) => {
            const target = `${this.options.targetFolder}/node_modules/${moduleName}`;
            ncp(`./node_modules/${moduleName}`, target, (err) => {
                if (err) {
                    debug(`Cannot copied ${moduleName} -> ${target}`, err);
                    return reject(err);
                }

                debug(`Copied ${moduleName} -> ${target}`);
                resolve();
            });
        });
    }
}

module.exports = ProjectGenerator;
