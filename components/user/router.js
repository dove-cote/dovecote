var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('dovecote/components/user/model');
var auth = require('dovecote/lib/middlewares/auth');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.post('/login', passport.authenticate('local'), function(req, res, next) {
    res.json(req.user);

    // Update last login date
    req.user.lastLoginDate = new Date();
    req.user.save();
});


router.get('/logout', auth.ensureAuthentication, function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/me', auth.ensureAuthentication, function(req, res, next) {
    res.json(req.user);
});


module.exports = router;
