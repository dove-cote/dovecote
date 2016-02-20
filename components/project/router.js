var express = require('express');
var router = express.Router();
var Project = require('dovecote/components/project/model');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
