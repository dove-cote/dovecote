var cote = require('cote', {multicast: '239.1.1.1'});

var multiplicationResponder = new cote.Responder({
    name: 'Multiplication Responder',
    key: 'multiply'
});

multiplicationResponder.on('multiply', function(req, cb) {
    cb(req.firstNumber * req.secondNumber);
});
