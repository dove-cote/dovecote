var sources = require('./sources');

module.exports = {
    name: 'calculator',
    project: {
        services: [
            {
                name: 'Calculation Service',
                meta: {position: {x: 90, y: 160}},
                components: [
                    {
                        name: 'Calculation Responder',
                        type: 'res',
                        external: true,
                        namespace: 'calculation'
                    },
                    {
                        name: 'Addition Requester',
                        type: 'req',
                        key: 'add'
                    },
                    {
                        name: 'Subtraction Requester',
                        type: 'req',
                        key: 'subtract'
                    },
                    {
                        name: 'Multiplication Requester',
                        type: 'req',
                        key: 'multiply'
                    },
                    {
                        name: 'Division Requester',
                        type: 'req',
                        key: 'divide'
                    }
                ],
                code: sources.calculationServiceCode
            },
            {
                name: 'Addition Service',
                meta: {position: {x: 320, y: 90}},
                components: [
                    {
                        name: 'Addition Responder',
                        type: 'res',
                        key: 'add'
                    }
                ],
                code: sources.additionServiceCode
            },
            {
                name: 'Subtraction Service',
                meta: {position: {x:20, y:200}},
                components: [
                    {
                        name: 'Subtraction Responder',
                        type: 'res',
                        key: 'subtract'
                    }
                ],
                code: sources.subtractionServiceCode
            },
            {
                name: 'Multiplication Service',
                meta: {position: {x: 200, y: 20}},
                components: [
                    {
                        name: 'Multiplication Responder',
                        type: 'res',
                        key: 'multiply'
                    }
                ],
                code: sources.multiplicationServiceCode
            },
            {
                name: 'Division Service',
                meta: {position: {x: 20, y: 80}},
                components: [
                    {
                        name: 'Division Responder',
                        type: 'res',
                        key: 'divide'
                    }
                ],
                code: sources.divisionServiceCode
            }
        ]
    }
};
