module.exports.ensureAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    next(new Error('Not authenticated.'));
};
