var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function(req, res){
	res.locals.title = 'Submit';
	res.render('submit');
});

router.post('/', function(req, res){

  var newLine = { text: req.body.line };

  User.findByIdAndUpdate(req.user._id, {
    $push: { lines: newLine }
  }, { 'new': true }, function(err, data) {
    res.redirect('/');
  });

});

module.exports = router;
