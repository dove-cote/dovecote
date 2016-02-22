var sources = require('./sources');

module.exports = {
    name: 'calculator',
    project: {
        services: [
            {
                name: 'Calculation Service',
                meta: {position: {x: 515, y: 252}},
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
                meta: {position: {x: 798, y: 488}},
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
                meta: {position: {x:248, y:250}},
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
                meta: {position: {x: 671, y: 82}},
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
                meta: {position: {x: 225, y: 443}},
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
