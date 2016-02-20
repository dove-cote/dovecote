var cote = require('cote');

var additionResponder = new cote.Responder({
    name: 'Addition Responder',
    key: 'add'
});

additionResponder.on('add', function(req, cb) {
    cb(req.firstNumber + req.secondNumber);
});
