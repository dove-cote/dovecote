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
                        type: 'req'
                    },
                    {
                        name: 'Subtraction Requester',
                        type: 'req'
                    },
                    {
                        name: 'Multiplication Requester',
                        type: 'req'
                    },
                    {
                        name: 'Division Requester',
                        type: 'req'
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
                        type: 'res'
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
                        type: 'res'
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
                        type: 'res'
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
                        type: 'res'
                    }
                ],
                code: sources.divisionServiceCode
            }
        ]
    }
};
