var cote = require('cote');

var divisionResponder = new cote.Responder({
    name: 'Division Responder',
    key: 'divide'
});

divisionResponder.on('divide', function(req, cb) {
    cb(req.firstNumber / req.secondNumber);
});
