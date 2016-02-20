var cote = require('cote');

var multiplicationResponder = new cote.Responder({
    name: 'Multiplication Responder',
    key: 'multiply'
});

multiplicationResponder.on('multiply', function(req, cb) {
    cb(req.firstNumber * req.secondNumber);
});
