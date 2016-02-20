var cote = require('cote', {multicast: '239.1.1.1'});

var subtractionResponder = new cote.Responder({
    name: 'Subtraction Responder',
    key: 'subtract'
});

subtractionResponder.on('subtract', function(req, cb) {
    cb(req.firstNumber + req.secondNumber);
});
