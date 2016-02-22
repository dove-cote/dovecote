var cote = require('cote', {multicast: '239.1.1.1'});

var catalogPublisher = new cote.Publisher({
    name: 'Catalog Publisher',
    namespace: 'catalog'
});

var catalogResponder = new cote.Responder({
    name: 'Catalog Responder',
    namespace: 'catalog',
    respondsTo: ['get catalog', 'get product', 'add product', 'delete product']
});

var stockRequester = new cote.Requester({
    name: 'Stock Requester',
    key: 'stock'
});

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
