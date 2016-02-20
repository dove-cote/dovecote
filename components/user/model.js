var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    lastLoginDate: Date
}, {timestamps: true});


module.exports = mongoose.model('User', userSchema);
