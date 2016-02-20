var express = require('express');
var router = express.Router();
var Component = require('dovecote/components/component/model');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
