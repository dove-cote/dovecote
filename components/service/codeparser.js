'use strict';

const vm = require('vm');
const util = require('util');
const _ = require('lodash');


class CodeParser {
    constructor(code, opt_options) {
        this.options = _.assign({}, CodeParser.defaults, opt_options || {});
        this.code = code;
    }


    run() {
        // Will check syntax immediately
        this.script = new vm.Script(this.code, this.options);

        const sandbox = {
            module: {exports: null}
        };
        const context = new vm.createContext(sandbox);
        this.script.runInContext(context);

        if (!_.isFunction(sandbox.module.exports))
            throw new Error('module.export is not a function');

        this.dependencies = CodeParser.getDependencies(sandbox.module.exports.toString());

        return {
            dependencies: this.dependencies,
            responseTos: this.getResponseTos()
        };
    }


    static getDependencies(code) {
        const paremeterRegex = /^(?:\s*function\s*)?(?:\w+\s*)?\(\s*([^\)]*)\)/;
        const matchResult = code.match(paremeterRegex);

        if (!matchResult || matchResult.length < 2)
            throw new Error('Cannot parse code');

        const argumentsStr = matchResult[1];
        return _.map(argumentsStr.split(','), argument => argument.trim());
    }


    getResponseTos() {
        const sandbox = {
            module: {exports: null}
        };

        this.dependencies.forEach((dependency) => {
            const mockDependency = {};

            mockDependency.on = (eventName) => {
                if (!mockDependency.on.results)
                    mockDependency.on.results = {};

                mockDependency.on.results[eventName] = true;
            }

            sandbox[dependency] = mockDependency;
        });

        const context = new vm.createContext(sandbox);
        const code = `${this.code}\n;module.exports(${this.dependencies.join(', ')});\n`;
        const script = new vm.Script(code, this.options);
        script.runInContext(context);

        const rv = {};

        this.dependencies.forEach((dependency) => {
            const results = sandbox[dependency].on.results;
            rv[dependency] = results ? _.keys(results) : [];
        });

        return rv;
    }
};


CodeParser.defaults = {
    timeout: 1000
};


module.exports = CodeParser;
