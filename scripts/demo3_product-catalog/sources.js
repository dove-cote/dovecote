exports.stockServiceCode = `
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
};
`;


exports.catalogServiceCode = `
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
};
`;
