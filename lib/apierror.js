'use strict';

function APIError(message, status, extra, level) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status || 500;
    this.extra = extra || {};
    this.level = level || APIError.Levels.indexOf('error');
}
APIError.prototype.__proto__ = Error.prototype;


APIError.Levels = [
    'emergency',
    'alert',
    'critical',
    'error',
    'warning',
    'notice',
    'info',
    'debug'
];


module.exports = APIError;
