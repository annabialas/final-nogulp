var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lineSchema = new Schema({
	text: String
});

var Line = mongoose.model('Line', lineSchema);

module.exports = Line;