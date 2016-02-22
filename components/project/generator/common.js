'use strict';

const fs = require('fs');
const _ = require('lodash');
const debug = require('debug')('dovecote:components:project:generator:common');


class CommonGenerator {
    constructor(projectData, options, requiredModules) {
        this.data = projectData;
        this.options = options;
        this.requiredModules = requiredModules;
    }


    run() {
        debug(`Generating common files...`);

        const jobs = [
            this.write('package.json', this.generatePackageJson()),
            this.write(`pm2.json`, this.generatePM2Config())
        ];

        return Promise.all(jobs);
    }


    write(fileName, content) {
        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/${fileName}`;
            debug(`Writing ${fileName}...`);

            fs.writeFile(path, content, (err) => {
                if (err) {
                    debug(`Cannot write file: ${fileName}`, err);
                    return reject(err);
                }

                debug(`Created file: ${fileName}`);
                resolve();
            })
        });
    }


    generatePackageJson() {
        const content = {
            "name": `${_.kebabCase(this.data.name)}`,
            "version": "1.0.0",
            "author": "Armagan Amcalar <armagan@amcalar.com",
            "license": "ISC",
            "dependencies": {
                "cote": "^0.8.1",
                "lodash": "^4.5.0",
                "mongoose": "^4.4.4",
                "socket.io": "^1.4.5"
            }
        };

        this.requiredModules.forEach((moduleName) => {
            content.dependencies[moduleName] = '*';
        });

        return JSON.stringify(content, null, 4);
    }


    generatePM2Config() {
        const content = { apps: [] };

        const filteredServices = _.filter(this.data.services, service => service.name != 'Gateway');

        content.apps = filteredServices.map((service) => {
            const kebabCasedName = _.kebabCase(service.name);
            return {
                name: `${this.data.owner._id}-${this.data.name}-${kebabCasedName}`,
                script: `services/${kebabCasedName}.js`,
                max_memory_restart: '50M',
                instace: service.instace
            };
        });

        return JSON.stringify(content, null, 4);
    }
}


module.exports = CommonGenerator;
