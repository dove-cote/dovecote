'use strict';

const _ = require('lodash');
const debug = require('debug')('dovecote:ficture');
const async = require('async-q');
const mongo = require('dovecote/lib/mongo');
const Multicast = require('dovecote/components/multicast/model');
const MulticastService = require('dovecote/components/multicast');
const User = require('dovecote/components/user/model');
const Project = require('dovecote/components/project/model');
const Service = require('dovecote/components/service/model');
const Component = require('dovecote/components/component/model');

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


function createComponents(opt_raw) {
    let raw = {
        type: 'req',
        name: 'Requester 1'
    };

    raw = _.assign(raw, opt_raw || {});
    const component = new Component(raw);
    debug(`Creating ${component.type} component as ${component.name}`);
    return component.save();
}

function createServices(opt_raw) {
    let raw = {
        name: 'Untitled Service'
    };

    raw = _.assign(raw, opt_raw || {});
    const service = new Service(raw);
    debug(`Creating service as ${service.name}`);
    return service.save();

}

/**
 * Add a demo project.
 * @returns {Promise}
 */
function projectFixture(opt_raw) {
    let raw = {
        name: "e-store",
        multicastIP_: '239.1.0.17',
        services: []
    };

    raw = _.assign(raw, opt_raw || {});
    debug(`Creating project ${raw.name}`)
    const project = new Project(raw);
    return project.save();
}
let user;


Promise
    .resolve()
    .then(() => {
        if (resetDB) return reset();
    })
    .then(() => multicastFixtures())
    .then(() => userFixture())
    .then(user_ => {
        user = user_;
        return Promise.all([
                createComponents({
                    name: 'Catalog Publisher',
                    type: 'pub',
                    external: true,
                    namespace: 'catalog'
                }),
                createComponents({
                    name: 'Catalog Responder',
                    type: 'res',
                    external: true,
                    namespace: 'catalog'
                }),
                createComponents({
                    name: 'Stock Requester',
                    type: 'req',
                    external: true,
                    namespace: 'catalog'
                }),
                createComponents({
                    name: 'Stock Responder',
                    type: 'res'
                })
            ])
        .then(components => _.map(components, '_id'));
    })
    .then(componentIds => {
        return Promise.all([
                createServices({
                    name: 'Catalog Service',
                    meta: {position: {x: 320, y: 90}},
                    components: [
                        componentIds[0],
                        componentIds[1],
                        componentIds[2]
                    ],
                    code: catalogServiceCode
                }),
                createServices({
                    name: 'Stock Service',
                    meta: {position: {x: 100, y: 100}},
                    components: [componentIds[3]],
                    code: stockServiceCode
                })
            ])
        .then(services => _.map(services, '_id'));

    })
    .then(serviceIds => projectFixture({owner: user._id, services: serviceIds}))
    .then(project => {
        debug('Fixture data created');
        process.exit()
    })
    .catch(err => console.log('Error when creating fixture data', err));
