const _ = require('lodash');
const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = mongoose.Schema({
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


userSchema.methods.toSafeJSON = function() {
    const privateFields = ['password', 'salt'];
    return _.omit(this.toJSON(), privateFields);
}


function sha256(password) {
    var shasum = crypto.createHash('sha256').update(password);
    return shasum.digest('hex');
}


module.exports = mongoose.model('User', userSchema);
