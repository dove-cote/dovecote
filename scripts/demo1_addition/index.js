var sources = require('./sources');

module.exports = {
    name: 'addition',
    project: {
        services: [
            {
                name: 'Addition Service',
                meta: {position: {x: 320, y: 90}},
                components: [
                    {
                        name: 'Addition Responder',
                        type: 'res',
                        external: true,
                        namespace: 'addition'
                    }
                ],
                code: sources.additionServiceCode
            }
        ]
    }
};
