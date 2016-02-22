module.exports = {
    "_id": "56ca5e6930e34d8e23c80787",
    "updatedAt": "2016-02-22T01:39:14.337Z",
    "createdAt": "2016-02-22T01:03:37.000Z",
    "name": "calculator",
    "owner": {
        "_id": "56ca5e6930e34d8e23c80781", "username": "dashersw", "email": "armagan@amcalar.com"
    }
    ,
    "__v": 1,
    "multicastIP_": "239.1.0.10",
    "deploy": {
        "deployFolder": "../preserved/generated/dashersw-calculator-1456105124696", "services": [{
            "name": "56ca5e6930e34d8e23c80781-calculator-calculation-service",
            "script": "services/calculation-service.js",
            "instance": 1,
            "cwd": "../preserved/generated/dashersw-calculator-1456105124696",
            "key": "",
            "namespace": null
        }, {
            "name": "56ca5e6930e34d8e23c80781-calculator-addition-service",
            "script": "services/addition-service.js",
            "instance": 1,
            "cwd": "../preserved/generated/dashersw-calculator-1456105124696",
            "key": "",
            "namespace": null
        }, {
            "name": "56ca5e6930e34d8e23c80781-calculator-subtraction-service",
            "script": "services/subtraction-service.js",
            "instance": 1,
            "cwd": "../preserved/generated/dashersw-calculator-1456105124696",
            "key": "",
            "namespace": null
        }, {
            "name": "56ca5e6930e34d8e23c80781-calculator-multiplication-service",
            "script": "services/multiplication-service.js",
            "instance": 1,
            "cwd": "../preserved/generated/dashersw-calculator-1456105124696",
            "key": "",
            "namespace": null
        }, {
            "name": "56ca5e6930e34d8e23c80781-calculator-division-service",
            "script": "services/division-service.js",
            "instance": 1,
            "cwd": "../preserved/generated/dashersw-calculator-1456105124696",
            "key": "",
            "namespace": null
        }], "container": {
            "id": "cc3998d4590f2b738d2960ca17194b173c6997f4168b1b3e72cce4a5974bf82c", "state": {
                "Status": "running",
                "Running": true,
                "Paused": false,
                "Restarting": false,
                "OOMKilled": false,
                "Dead": false,
                "Pid": 12259,
                "ExitCode": 0,
                "Error": "",
                "StartedAt": "2016-02-22T01:39:14.331122649Z",
                "FinishedAt": "0001-01-01T00:00:00Z"
            }
            ,
            "containerIP": "172.17.0.2", "port": "32825", "host": "169.45.231.138"
        }
    }
    ,
    "state": "running",
    "services": [{
        "_id": "56ca5e6930e34d8e23c8078f",
        "updatedAt": "2016-02-22T01:14:23.290Z",
        "createdAt": "2016-02-22T01:03:37.000Z",
        "code": "\nmodule.exports = function(calculationResponder, additionRequester, subtractionRequester, multiplicationRequester, divisionRequester) {\n    calculationResponder.on('add', function(req, cb) {\n        additionRequester.send(req, cb);\n    });\n\n    calculationResponder.on('subtract', function(req, cb) {\n        subtractionRequester.send(req, cb);\n    });\n\n    calculationResponder.on('multiply', function(req, cb) {\n        multiplicationRequester.send(req, cb);\n    });\n\n    calculationResponder.on('divide', function(req, cb) {\n        divisionRequester.send(req, cb);\n    });\n};\n",
        "meta": {"position": {"x": 344, "y": 210}},
        "uniqueKey": "56ca5e6930e34d8e23c80787/Calculation Service",
        "__v": 0,
        "key": "",
        "components": [{
            "_id": "56ca5e6930e34d8e23c8078a",
            "updatedAt": "2016-02-22T01:14:23.284Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "res",
            "namespace": "calculation",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Calculation Service/Calculation Responder",
            "__v": 0,
            "key": "",
            "external": true,
            "name": "Calculation Responder"
        }, {
            "_id": "56ca5e6930e34d8e23c8078b",
            "updatedAt": "2016-02-22T01:14:23.285Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "req",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Calculation Service/Addition Requester",
            "__v": 0,
            "key": "add",
            "external": false,
            "name": "Addition Requester"
        }, {
            "_id": "56ca5e6930e34d8e23c8078c",
            "updatedAt": "2016-02-22T01:14:23.287Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "req",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Calculation Service/Subtraction Requester",
            "__v": 0,
            "key": "subtract",
            "external": false,
            "name": "Subtraction Requester"
        }, {
            "_id": "56ca5e6930e34d8e23c8078d",
            "updatedAt": "2016-02-22T01:14:23.288Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "req",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Calculation Service/Multiplication Requester",
            "__v": 0,
            "key": "multiply",
            "external": false,
            "name": "Multiplication Requester"
        }, {
            "_id": "56ca5e6930e34d8e23c8078e",
            "updatedAt": "2016-02-22T01:14:23.289Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "req",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Calculation Service/Division Requester",
            "__v": 0,
            "key": "divide",
            "external": false,
            "name": "Division Requester"
        }],
        "instance": 1,
        "name": "Calculation Service"
    }, {
        "_id": "56ca5e6930e34d8e23c80791",
        "updatedAt": "2016-02-22T01:14:23.296Z",
        "createdAt": "2016-02-22T01:03:37.000Z",
        "code": "\nmodule.exports = function(additionResponder) {\n    additionResponder.on('add', function(req, cb) {\n        cb(req.firstNumber + req.secondNumber);\n    });\n};\n",
        "meta": {"position": {"x": 707, "y": 210}},
        "uniqueKey": "56ca5e6930e34d8e23c80787/Addition Service",
        "__v": 0,
        "key": "",
        "components": [{
            "_id": "56ca5e6930e34d8e23c80790",
            "updatedAt": "2016-02-22T01:14:23.293Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "res",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Addition Service/Addition Responder",
            "__v": 0,
            "key": "add",
            "external": false,
            "name": "Addition Responder"
        }],
        "instance": 1,
        "name": "Addition Service"
    }, {
        "_id": "56ca5e6930e34d8e23c80793",
        "updatedAt": "2016-02-22T01:14:23.303Z",
        "createdAt": "2016-02-22T01:03:37.000Z",
        "code": "\nmodule.exports = function(subtractionResponder) {\n    subtractionResponder.on('subtract', function(req, cb) {\n        cb(req.firstNumber + req.secondNumber);\n    });\n};\n",
        "meta": {"position": {"x": 102, "y": 130}},
        "uniqueKey": "56ca5e6930e34d8e23c80787/Subtraction Service",
        "__v": 0,
        "key": "",
        "components": [{
            "_id": "56ca5e6930e34d8e23c80792",
            "updatedAt": "2016-02-22T01:14:23.301Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "res",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Subtraction Service/Subtraction Responder",
            "__v": 0,
            "key": "subtract",
            "external": false,
            "name": "Subtraction Responder"
        }],
        "instance": 1,
        "name": "Subtraction Service"
    }, {
        "_id": "56ca5e6930e34d8e23c80795",
        "updatedAt": "2016-02-22T01:14:23.306Z",
        "createdAt": "2016-02-22T01:03:37.000Z",
        "code": "\nmodule.exports = function(multiplicationResponder) {\n    multiplicationResponder.on('multiply', function(req, cb) {\n        cb(req.firstNumber * req.secondNumber);\n    });\n};\n",
        "meta": {"position": {"x": 561, "y": 29}},
        "uniqueKey": "56ca5e6930e34d8e23c80787/Multiplication Service",
        "__v": 0,
        "key": "",
        "components": [{
            "_id": "56ca5e6930e34d8e23c80794",
            "updatedAt": "2016-02-22T01:14:23.305Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "res",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Multiplication Service/Multiplication Responder",
            "__v": 0,
            "key": "multiply",
            "external": false,
            "name": "Multiplication Responder"
        }],
        "instance": 1,
        "name": "Multiplication Service"
    }, {
        "_id": "56ca5e6930e34d8e23c80797",
        "updatedAt": "2016-02-22T01:14:23.310Z",
        "createdAt": "2016-02-22T01:03:37.000Z",
        "code": "\nmodule.exports = function(divisionResponder) {\n    divisionResponder.on('divide', function(req, cb) {\n        cb(req.firstNumber / req.secondNumber);\n    });\n};\n",
        "meta": {"position": {"x": 736, "y": 432}},
        "uniqueKey": "56ca5e6930e34d8e23c80787/Division Service",
        "__v": 0,
        "key": "",
        "components": [{
            "_id": "56ca5e6930e34d8e23c80796",
            "updatedAt": "2016-02-22T01:14:23.309Z",
            "createdAt": "2016-02-22T01:03:37.000Z",
            "type": "res",
            "uniqueKey": "56ca5e6930e34d8e23c80787/Division Service/Division Responder",
            "__v": 0,
            "key": "divide",
            "external": false,
            "name": "Division Responder"
        }],
        "instance": 1,
        "name": "Division Service"
    }]
}
