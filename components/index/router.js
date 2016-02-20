var express = require('express');
var router = express.Router();
var fs = require('fs');
var auth = require('dovecote/lib/middlewares/auth');


router.get('/', function(req, res) {
    res.render('index');
});


const URLS_LOGGED_OUT = ['/login', '/register'];

URLS_LOGGED_OUT.forEach(function (url) {
    router.get(url, auth.ensureNoAuthentication, renderApp);
})


const URLS_LOGGED_IN = ['/logout', '/projects', 'project/:id', '/dashboard'];

URLS_LOGGED_IN.forEach(function (url) {
    router.get(url, auth.ensureAuthenticationOrRedirect, renderApp);
})


function renderApp(req, res) {

    var bundle = '/bundle.js';

    var isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
        try {
            var stats = JSON.parse(fs.readFileSync(__dirname + '/../../public/stats.json'));
            bundle = '/' + stats.assetsByChunkName.main[0];
        } catch(e) {
            console.log('error', e);
        }
    } else {
        bundle = 'http://localhost:3000/static/bundle.js';
    }

    res.render('dashboard', {
        bundle: bundle
    });
}


module.exports = router;
