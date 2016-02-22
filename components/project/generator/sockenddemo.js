'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('dovecote:components:project:generator:sockenddemo');
const CodeParser = require('dovecote/components/service/codeparser');

class SockendDemoGenerator {
    constructor(deployData) {
        this.data = deployData;
        this.namespaces = [];
    }


    run() {
        debug('Generating index.html for sockend demo...');

        return new Promise((resolve, reject) => {
            const path_ = path.resolve(process.cwd(), this.data.deploy.deployFolder, 'index.html');
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
        const port = this.data.deploy.container.port;
        const url = `http://${host}:${port}`;

        const services = this.data.services.map(this.generateService.bind(this)).join('');

        const endpoints = this.generateEndpoints();

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="/socket.io/socket.io.js"></script>
    <link rel="stylesheet" href="https://dove-cote.co/assets/css/styles.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js"></script>
    <style>
        body {
            background: #0097A7;
            color: white;
            font-size: 1.4em;
            line-height: 2em;
        }
        h1,h2,h3,h4,h5,h6,a {
            color: white;
        }
        pre {
            background: #212121;
            line-height: 1.5;
        }
        code {
            padding: 0 30px;
        }

        #editor {
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            height: 600px;
            width: 950px;
            font-size: 16px;
        }
    </style>
</head>
<body>
<h1>Hello from DoveCôte!</h1>
<p>
    Your services are reachable from location <strong>${url}</strong>.<br/>
    If you want, you can open the console and start interacting with your
    services right now, or just use this url as a websocket endpoint.
</p>
<p>
    <a href="https://github.com/dashersw/cote" target="_blank">See cote.js docs</a>
</p>

<div>
    <h2>Services</h2>
    <ul>
    ${services}
    </ul>
</div>
<div>
    <h2>Endpoints</h2>
    <ul>
    ${endpoints}
    </ul>
</div>
<div>
</div>
<script>
var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    </script>
</body>
</html>
`;
    }

    generateService(service) {
        const components = service.components.map(this.generateComponent.bind(this, service)).join('');
        return `<li>${service.name} <ul>${components}</ul></li>`;
    }

    generateComponent(service, component) {
        const parser = new CodeParser(service.code);

        if (component.external) {
            this.namespaces.push({
                namespace: component.namespace,
                respondsTo: parser.run().responseTos,
                componentName: _.camelCase(component.name)
            });
        }

        return `
<li>${component.name}</li>
        `
    }

    generateEndpoints() {
        const host = process.env.DEPLOY_HOST || 'localhost';
        const port = this.data.deploy.container.port;

        const url = `http://${host}:${port}`;

        const uniqueNamespaces = _.uniq(this.namespaces);

        return uniqueNamespaces.map(namespace => {
            const test = this.generateTests(namespace);

            return `
<li>${url}/${namespace.namespace}
    <div>
        ${test}
    </div>
</li>
`;
        });
    }

    generateTests(namespace) {
        const host = process.env.DEPLOY_HOST || 'localhost';
        const port = this.data.deploy.container.port;

        const url = `http://${host}:${port}/${namespace.namespace}`;

        const eventNames = namespace.respondsTo[namespace.componentName];

        const emits = eventNames.map(eventName => {
            return `
// Tests for event "${eventName}"
var ${eventName}Request = { // fill in your request object

};
var ${eventName}Callback = function(args) { // fill in your callback
    console.log.apply(console, arguments);
};
${namespace.namespace}.emit("${eventName}", ${eventName}Request, ${eventName}Callback);
`
        }).join('\n\n    ');

        return `
<h2>Tests</h2>
<p>You can edit the code below as you wish, and copy & paste in the console to see how it works.</p>
<div id="editor">
// This line is already executed for you and variable ${namespace.namespace} is available in the console!
var ${namespace.namespace} = io.connect("${url}");

// Type the following lines, fill in the details according to your specs and watch it just work!
${emits}
</div>
<script>
var ${namespace.namespace} = io.connect("${url}");
</script>
`;
    }
}


module.exports = SockendDemoGenerator;
