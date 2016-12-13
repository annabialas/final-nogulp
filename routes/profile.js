var express = require('express');
var router = express.Router();

var User = require('../models/user');

function isAuthenticated(req, res, next) {

    if (req.user) {
        return next();
    }

    res.redirect('login');
}

router.get('/', isAuthenticated, function(req, res){

	res.locals.title = 'My Profile';

	User.findById(req.user._id, function (err, data) {
	    var pageData = {
	      users: data
		};

	    res.render('profile', pageData);
	});
});

router.put('/:id', isAuthenticated, function(req, res) {

	var userEdit = {
	    username: req.body.new_username,
	};

  	User.findOneAndUpdate( {_id: req.params.id}, userEdit, function(err, user) {
    	res.send(user);
  	});

});


module.exports = router;