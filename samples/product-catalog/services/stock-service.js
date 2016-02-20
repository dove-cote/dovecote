var cote = require('cote', {multicast: '239.1.1.1'});

var stockResponder = new cote.Responder({
    name: 'Stock Responder'
});

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
