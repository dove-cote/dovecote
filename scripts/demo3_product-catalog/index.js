var sources = require('./sources');

module.exports = {
    name: 'product-catalog',
    project: {
        services: [
            {
                name: 'Catalog Service',
                meta: {position: {x: 320, y: 90}},
                components: [
                    {
                        name: 'Catalog Publisher',
                        type: 'pub',
                        external: true,
                        namespace: 'catalog'
                    },
                    {
                        name: 'Catalog Responder',
                        type: 'res',
                        external: true,
                        namespace: 'catalog'
                    },
                    {
                        name: 'Stock Requester',
                        type: 'req',
                        key: 'stock',
                        external: false
                    }
                ],
                code: sources.catalogServiceCode
            },
            {
                name: 'Stock Service',
                meta: {position: {x: 100, y: 100}},
                components: [
                    {
                        name: 'Stock Responder',
                        key: 'stock',
                        type: 'res'
                    }
                ],
                code: sources.stockServiceCode
            }
        ]
    }
};
