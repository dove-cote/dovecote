var express = require('express');
var router = express.Router();
var User = require('dovecote/components/user/model');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
