'use script';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    twitter: {
        id: String,
        username: String,
        displayname: String
    }
});

module.exports = mongoose.model('User', User);