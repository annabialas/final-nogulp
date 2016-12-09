var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var lineSchema = new Schema({
	text: String
});

var User = new Schema({
	role: String,
	lines: [lineSchema]
});


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);



