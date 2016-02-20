var cote = require('cote', {multicast: '239.1.1.1'});

var calculationResponder = new cote.Responder({
    name: 'Calculation Responder',
    namespace: 'calculator',
    respondsTo: ['add', 'subtract', 'multiply', 'divide']
});

var additionRequester = new cote.Requester({
    name: 'Addition Requester',
    key: 'add'
});

var subtractionRequester = new cote.Requester({
    name: 'Subtraction Requester',
    key: 'subtract'
});

var multiplicationRequester = new cote.Requester({
    name: 'Multiplication Requester',
    key: 'multiply'
});

var divisionRequester = new cote.Requester({
    name: 'Division Requester',
    key: 'divide'
});

calculationResponder.on('add', function(req, cb) {
    additionRequester.send(req, cb);
});

calculationResponder.on('subtract', function(req, cb) {
    subtractionRequester.send(req, cb);
});

calculationResponder.on('multiply', function(req, cb) {
    multiplicationRequester.send(req, cb);
});

calculationResponder.on('divide', function(req, cb) {
    divisionRequester.send(req, cb);
});
