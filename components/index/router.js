var express = require('express');
var router = express.Router();
var fs = require('fs');
var auth = require('dovecote/lib/middlewares/auth');


router.get('/', function(req, res) {
    res.render('index');
});


// TODO: a single array of public urls
router.get('/login', renderApp);
router.get('/register', renderApp);


router.get('/dashboard',
    // auth.ensureAuthenticationOrRedirect, // TODO: comment in for authentication check
    renderApp);


router.get('/projects',
    // auth.ensureAuthenticationOrRedirect, // TODO: comment in for authentication check
    renderApp);

router.get('/project/:id',
    // auth.ensureAuthenticationOrRedirect, // TODO: comment in for authentication check
    renderApp);


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
