'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('sockenddemo');


class SockendDemoGenerator {
    constructor(deployData) {
        this.data = deployData;
    }


    run() {
        debug('Generating index.html for sockend demo...');

        if (!this.data.sockend) {
            debug('Sockend not found, skipping');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const path_ = path.resolve(process.cwd(), this.data.sockend.cwd, 'index.html');
            fs.writeFile(path_, this.generateIndex(), (err) => {
                if (err) {
                    debug('Could not write index.html', err);
                    return reject(err);
                }

                debug(`Created index.html: ${path_}`);
                resolve();
            });
        });
    }


    generateIndex() {
        const host = process.env.DEPLOY_HOST || 'localhost';
        const port = this.data.container.port;
        const url = `http://${host}:${port}`;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Title</title>
                <script src="/socket.io/socket.io.js"></script>
            </head>
            <body>
            <h1>Hello from DoveCote</h1>
            <p>
                Your services are reachable from location <strong>${url}</strong>.
                If you want, you can open the console and start interacting with your
                services right now, or just use this url as a websocket endpoint.
            </p>
            <p>
                <a href="https://github.com/dashersw/cote" target="_blank">See cote.js docs</a>
            </p>
            <script>
                window.sockend = io.connect('${url}/${this.data.sockend.namespace}');

                sockend.on('update', function() {

                });
            </script>
            </body>
            </html>`;
    }
}


module.exports = SockendDemoGenerator;
