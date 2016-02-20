var cote = require('cote', {multicast: '239.1.1.1'});

var additionResponder = new cote.Responder({
    name: 'Addition Responder',
    key: 'add'
});

additionResponder.on('add', function(req, cb) {
    cb(req.firstNumber + req.secondNumber);
});
