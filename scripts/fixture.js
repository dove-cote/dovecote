'use strict';

const _ = require('lodash');
const debug = require('debug')('dovecote:fixture');
const async = require('async-q');
const mongo = require('dovecote/lib/mongo');
const Multicast = require('dovecote/components/multicast/model');
const MulticastService = require('dovecote/components/multicast/service');
const User = require('dovecote/components/user/model');
const Project = require('dovecote/components/project/model');
const Service = require('dovecote/components/service/model');
const Component = require('dovecote/components/component/model');
const ProjectService = require('dovecote/components/project/service');

const resetDB = !!~process.argv.indexOf('--reset');

const stockServiceCode = `
module.exports = function(stockResponder) {
    var stock = {
        superProduct: 13
    };

    stockResponder.on('change stock', function(req, cb) {
        stock[req.productId] += req.stock;
        cb(null, 200);
    });

    stockResponder.on('create stock', function(req, cb) {
        stock[req.productId] = req.stock;
        cb(null, 200);
    });

    stockResponder.on('delete stock', function(req, cb) {
        delete stock[req.productId];
        cb(null, 200);
    });

    stockResponder.on('get stock', function(req, cb) {
        cb(null, stock[req.productId]);
    });
}
`;

const catalogServiceCode = `
module.exports = function(catalogPublisher, catalogResponder, stockRequester) {
    var products = {
        superProduct: {
            id: 'superProduct'
        }
    };

    catalogResponder.on('add product', function(req, cb) {
        stockRequester.send({
            type: 'create stock',
            productId: req.product.id,
            stock: req.product.stock
        }, function(err, res) {
            delete req.product.stock;

            products[req.product.id] = req.product;

            catalogPublisher.publish('update');

            cb(null, 200);
        });
    });

    catalogResponder.on('delete product', function(req, cb) {
        delete products[req.id];

        catalogPublisher.publish('catalog update');

        cb(null, 200);
    });

    catalogResponder.on('get catalog', function(req, cb) {
        cb(null, products);
    });

    catalogResponder.on('get product', function(req, cb) {
        if (!products[req.id]) return cb(Error('Not found'), 404);

        var product = JSON.parse(JSON.stringify(products[req.id]));

        stockRequester.send({type: 'get stock', productId: req.id}, function(err, stock) {
            product.stock = stock;

            cb(err, product);
        });
    });
}
`;


/**
 * Removes all collections.
 * @returns {Promise}
 */
function reset() {
    return User
        .remove()
        .then(() => Multicast.remove())
        .then(() => Service.remove())
        .then(() => Component.remove())
        .then(() => Project.remove());
}

/**
 * Fills ip records.
 * @returns {Promise}
 */
function multicastFixtures() {
    debug(`Multicast Fixtures`);
    const ip = [239, 1, 0, 0];
    const ipList = [];
    while (ip[2] <= 255) {
        ip[3] = 0;
        while (ip[3] < 255) {
            ip[3]++;
            ipList.push(ip.join('.'));
        }
        ip[2]++;
    }
    debug(`Adding ${ipList.length} ip records (this may take some ~3mins, be patient)`);
    return async.eachLimit(ipList, 30, ip => {
        return MulticastService.create(ip);
    });
}

const demoProjects = [
    {
        name: 'prouct-catalog',
        project: {
            multicastIP_: '239.1.0.17',
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
                            external: true,
                            namespace: 'catalog'
                        }
                    ],
                    code: catalogServiceCode
                },
                {
                    name: 'Stock Service',
                    meta: {position: {x: 100, y: 100}},
                    components: [
                        {
                            name: 'Stock Responder',
                            type: 'res'
                        }
                    ],
                    code: stockServiceCode
                }
            ]
        }
    }
];


/**
 * Adds test user
 * @returns {Promise}
 */
function userFixture() {
    const user = new User({
        username: 'test',
        email: 'test@dove-cote.co'
    });

    user.setPassword('asdf123');
    debug(`Creating user ${user.username}`);
    return user.save();
}


/**
 * Create project
 * @param {Object} project
 * @returns {Promise}
 */
function createProject(raw, user) {
    return ProjectService
        .create({
            name: raw.name,
            owner: user._id
        })
        .then(project => ProjectService.save(project._id, raw.project));
}


Promise
    .resolve()
    .then(() => {
        if (resetDB) return reset();
    })
    .then(() => multicastFixtures())
    .then(() => userFixture())
    .then(user => async.eachSeries(demoProjects, project => createProject(project, user)))
    .then(project => {
        debug('Fixture data created');
        process.exit()
    })
    .catch(err => console.log('Error when creating fixture data', err));
