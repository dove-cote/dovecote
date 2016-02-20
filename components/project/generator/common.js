'use strict';

const fs = require('fs');
const _ = require('lodash');


class CommonGenerator {
    constructor(projectData, options) {
        this.data = projectData;
        this.options = options;
    }


    run() {
        const jobs = [
            this.write('index.html', this.generateIndex()),
            this.write('package.json', this.generatePackageJson()),
            this.write(`${_.kebabCase(this.data.name)}.json`, this.generatePM2Config())
        ];

        return Promise.all(jobs);
    }


    write(fileName, content) {
        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/${fileName}`;
            fs.writeFile(path, content, (err) => {
                if (err) return reject(err);
                resolve();
            })
        });
    }


    generateIndex() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Title</title>
                <script src="/socket.io/socket.io.js"></script>
            </head>
            <body>
            <script>
                var catalog = io.connect('localhost:5555/catalog');

                catalog.emit('add product', {
                    product: {
                        id: 'goodProduct',
                        stock: 3
                    }
                }, function() {
                });

                catalog.on('update', function() {
                    catalog.emit('get catalog', function(err, catalog) {
                        console.log('catalog', catalog);
                    });
                });
            </script>
            </body>
            </html>`;
    }


    generatePackageJson() {
        const content = {
            "name": `${_.kebabCase(this.data.name)}`,
            "version": "1.0.0",
            "author": "Armagan Amcalar <armagan@amcalar.com",
            "license": "ISC",
            "dependencies": {
                "cote": "^0.7.2",
                "socket.io": "^1.4.5"
            }
        };

        return JSON.stringify(content, null, 4);
    }


    generatePM2Config() {
        const content = { apps: [] };

        content.apps = this.data.services.map((service) => {
            const kebabCasedName = _.kebabCase(service.name);
            return {
                name: `${this.data.name}-${kebabCasedName}`,
                script: `services/${kebabCasedName}.js`,
                watch: true
            };
        });

        return JSON.stringify(content, null, 4);
    }
}


module.exports = CommonGenerator;
