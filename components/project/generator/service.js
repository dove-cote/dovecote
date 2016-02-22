'use strict';

const _ = require('lodash');
const fs = require('fs');
const debug = require('debug')('dovecote:components:project:generator:service');
const CodeParser = require('dovecote/components/service/codeparser');


class ServiceGenerator {
    constructor(serviceData, multicastIp, options) {
        this.options = options;
        this.data = serviceData;
        this.multicastIp = multicastIp;
        this.name = _.kebabCase(this.data.name);
    }


    run() {
        if (this.data.name == 'Gateway') {
            debug(`Ignoring to generate "Getaway" named service, skipping`);
            return Promise.resolve();
        }

        debug(`Generating service: ${this.data.name}`);

        return this.
            parseCode().
            then(() => Promise.all([
                this.writeOriginal(),
                this.generateAndWrite()
            ]));
    }


    parseCode() {
        return new Promise((resolve, reject) => {
            debug(`Parsing service code: ${this.data.name}`);
            const codeParser = new CodeParser(this.data.code);

            try {
                this.parseResults = codeParser.run();
                debug(`Parsed service code: ${this.data.name}`);
                resolve();
            } catch(err) {
                debug(`Cannot parse service code: ${this.data.name}`, err);
                reject(err);
            }
        });
    }


    writeOriginal() {
        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/services/${this.name}-original.js`;
            debug(`Writing original service code: ${this.name}`);

            fs.writeFile(path, this.data.code, (err) => {
                if (err) {
                    debug(`Writing original service code: ${this.name}`);
                    return reject(err);
                }

                debug(`Created original service code: ${this.name}`);
                resolve();
            })
        });
    }


    generateAndWrite() {
        debug(`Generating service code: ${this.name}`);
        let code = this.template_header();
        code += indent(2);

        this.data.components.forEach((component) => {
            code += this.template_component(component);
            code += indent(2);
        });

        code += this.template_footer() + indent(1);
        debug(`Generated, now will try to save it: ${this.name}`);

        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/services/${this.name}.js`;
            fs.writeFile(path, code, (err) => {
                if (err) {
                    debug(`Cannot save service code: ${this.name}`, err);
                    return reject(err);
                }

                debug(`Saved service code: ${this.name}`);
                resolve();
            })
        });
    }


    template_component(data) {
        switch (data.type) {
            case 'req':
                return this.template_requester(data);
            case 'res':
                return this.template_responder(data);
            case 'pub':
                return this.template_publisher(data);
            case 'sub':
                return this.template_subcriber(data);
            default:
                return '';
        }
    }


    template_requester(data) {
        const options = {
            name: data.name
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

        if (data.key)
            options.key = data.key;

        const optionsStr = JSON.stringify(options, null, 4);

        return `var ${_.camelCase(data.name)} = new cote.Requester(${optionsStr});`;
    }


    template_responder(data) {
        const camelCasedName = _.camelCase(data.name);
        const options = {
            name: data.name,
            respondsTo: this.parseResults.responseTos[camelCasedName]
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

        if (data.key)
            options.key = data.key;

        const optionsStr = JSON.stringify(options, null, 4);

        return `var ${camelCasedName} = new cote.Responder(${optionsStr});`;
    }


    template_publisher(data) {
        const options = {
            name: data.name
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

        if (data.key)
            options.key = data.key;

        const optionsStr = JSON.stringify(options, null, 4);

        return `var ${_.camelCase(data.name)} = new cote.Publisher(${optionsStr});`;
    }


    template_subcriber(data) {
        const options = {
            name: data.name
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

        if (data.key)
            options.key = data.key;

        const optionsStr = JSON.stringify(options, null, 4);

        return `var ${_.camelCase(data.name)} = new cote.Subscriber(${optionsStr});`;
    }


    template_header() {
        return `var cote = require('cote', {multicast: '${this.multicastIp}'});`;
    }


    template_footer() {
        return [
            `var original = require('./${this.name}-original.js');`,
            `original(${this.parseResults.dependencies.join(', ')});`
        ].join('\n');
    }
}


function indent(count) {
    return ('\n').repeat(count);
};


module.exports = ServiceGenerator;
