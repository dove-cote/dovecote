var express = require('express');
var router = express.Router();
var Service = require('dovecote/components/service/model');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
