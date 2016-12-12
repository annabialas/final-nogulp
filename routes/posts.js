var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function(req, res){
	res.locals.title = 'My Posts';

	User.findById(req.user._id, function (err, data) {
	    var pageData = {
	      users: data
		};

	    res.render('my-posts', pageData);
	});
});

module.exports = router;