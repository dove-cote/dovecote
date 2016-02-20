exports.additionServiceCode = `
module.exports = function(additionResponder) {
    additionResponder.on('add', function(req, cb) {
        cb(req.firstNumber + req.secondNumber);
    });
};
`;
