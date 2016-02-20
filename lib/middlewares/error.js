"use strict";

const APIError = require('dovecote/lib/apierror');

module.exports = function(err, req, res, next) {
    let shownError = {message: 'Server error'};

    if (err instanceof APIError) {
        shownError = err;
    } else if (err instanceof Error) {
        shownError = {message: err.toString()};
    }

    shownError.level = APIError.Levels[err.level || 3];
    res.status(err.status || 500);
    delete shownError.status;

    res.json({ error: shownError, now: Date.now() }).end();
};
