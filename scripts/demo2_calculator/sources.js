exports.additionServiceCode = `
module.exports = function(additionResponder) {
    additionResponder.on('add', function(req, cb) {
        cb(req.firstNumber + req.secondNumber);
    });
};
`;

exports.calculationServiceCode = `
module.exports = function(calculationResponder, additionRequester, subtractionRequester, multiplicationRequester, divisionRequester) {
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
};
`;

exports.divisionServiceCode = `
module.exports = function(divisionResponder) {
    divisionResponder.on('divide', function(req, cb) {
        cb(req.firstNumber / req.secondNumber);
    });
};
`;

exports.multiplicationServiceCode = `
module.exports = function(multiplicationResponder) {
    multiplicationResponder.on('multiply', function(req, cb) {
        cb(req.firstNumber * req.secondNumber);
    });
};
`;

exports.subtractionServiceCode = `
module.exports = function(subtractionResponder) {
    subtractionResponder.on('subtract', function(req, cb) {
        cb(req.firstNumber + req.secondNumber);
    });
};
`;
