module.exports.ensureAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    next(new Error('Not authenticated.'));
};


module.exports.ensureAuthenticationOrRedirect = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};


module.exports.ensureNoAuthentication = function(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/projects'); // TODO: not sure where to redirect
};
