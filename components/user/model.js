var mongoose = require('mongoose');
var crypto = require('crypto');


var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: { type: String, required: true, default: () => Math.random().toString(36).substring(7)},
    email: {type: String, required: true, unique: true},
    lastLoginDate: Date
}, {timestamps: true});


userSchema.methods.checkPassword = function(password) {
    return this.password === sha256(password + this.salt);
};


userSchema.methods.setPassword = function(password) {
    this.password = sha256(password + this.salt);
    return this;
};


function sha256(password) {
    var shasum = crypto.createHash('sha256').update(password);
    return shasum.digest('hex');
}


module.exports = mongoose.model('User', userSchema);
