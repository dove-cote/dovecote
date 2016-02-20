var cote = require('cote', {multicast: '239.1.1.1'});

var divisionResponder = new cote.Responder({
    name: 'Division Responder',
    key: 'divide'
});

divisionResponder.on('divide', function(req, cb) {
    cb(req.firstNumber / req.secondNumber);
});
