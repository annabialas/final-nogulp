var express = require('express');
var router = express.Router();

var User = require('../models/user');

function isAuthenticated(req, res, next) {

    if (req.user) {
        return next();
    }
    
    res.redirect('login');
    // res.redirect('login', {
    //     flash: {
    //       header: 'Permission Denied',
    //       body: 'You must be logged in to see this page.'
    //     }
    // }); // I know we can't display flash messages with redirects, but is there an alternative?
}

router.get('/', isAuthenticated, function(req, res){
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
