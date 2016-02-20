'use strict';

const _ = require('lodash');
const fs = require('fs');
const CodeParser = require('dovecote/components/service/codeparser');


class ServiceGenerator {
    constructor(serviceData, multicastIp, options) {
        this.options = options;
        this.data = serviceData;
        this.multicastIp = multicastIp;
        this.name = _.kebabCase(this.data.name);
    }


    run() {
        return this
            .parseCode()
            .then(() => Promise.all([
                this.writeOriginal(),
                this.generateAndWrite()
            ]));
    }


    parseCode() {
        return new Promise((resolve, reject) => {
            const codeParser = new CodeParser(this.data.code);

            try {
                this.parseResults = codeParser.run();
                resolve();
            } catch(err) {
                reject(err);
            }
        });
    }


    writeOriginal() {
        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/services/${this.name}-original.js`;
            fs.writeFile(path, this.data.code, (err) => {
                if (err) return reject(err);
                resolve();
            })
        });
    }


    generateAndWrite() {
        let code = this.template_header();
        code += indent(2);

        this.data.components.forEach((component) => {
            code += this.template_component(component);
            code += indent(2);
        });

        code += this.template_footer() + indent(1);

        return new Promise((resolve, reject) => {
            const path = `${this.options.targetFolder}/services/${this.name}.js`;
            fs.writeFile(path, code, (err) => {
                if (err) return reject(err);
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
            name: data.name,
            key: _.kebabCase(data.name)
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

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

        const optionsStr = JSON.stringify(options, null, 4);

        return `var ${camelCasedName} = new cote.Responder(${optionsStr});`;
    }


    template_publisher(data) {
        const options = {
            name: data.name
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

        const optionsStr = JSON.stringify(options, null, 4);

        return `var ${_.camelCase(data.name)} = new cote.Publisher(${optionsStr});`;
    }


    template_subcriber(data) {
        const options = {
            name: data.name
        };

        if (data.external || data.namespace)
            options.namespace = data.namespace;

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
