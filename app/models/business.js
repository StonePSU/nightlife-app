'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Business = new Schema({
    business_id: String,
    date_going: Date,
    participants: [String]
});

module.exports = mongoose.model('Business', Business);