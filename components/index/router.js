var express = require('express');
var router = express.Router();
var fs = require('fs');
var auth = require('dovecote/lib/middlewares/auth');


router.get('/', function(req, res) {
    res.render('index');
});


router.get('/login', renderApp);


router.get('/dashboard',
    // auth.ensureAuthenticationOrRedirect, // TODO: comment in for authentication check
    renderApp);


function renderApp(req, res) {
    var bundle = 'bundle.js';

    try {
        var stats = JSON.parse(fs.readFileSync(__dirname + '/../../public/stats.json'));
        bundle = stats.assetsByChunkName.main[0];
    } catch(e) {
        console.log(e);
    }

    res.render('dashboard', {
        bundle: bundle
    });
}


module.exports = router;
