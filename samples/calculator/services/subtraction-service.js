var cote = require('cote');

var subtractionResponder = new cote.Responder({
    name: 'Subtraction Responder',
    key: 'subtract'
});

subtractionResponder.on('subtract', function(req, cb) {
    cb(req.firstNumber + req.secondNumber);
});
