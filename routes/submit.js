var express = require('express');
var router = express.Router();
// var https = require('https');

var User = require('../models/user');

router.get('/', function(req, res){
	res.locals.title = 'Submit';
	res.render('submit');
});

router.post('/', function(req, res){

  // var line = new Line({
  //     text: req.body.line
  // });

  var newLine = { text: req.body.line };

  User.findByIdAndUpdate(req.user._id, {
    $push: { lines: newLine }
  }, { 'new': true }, function(err, data) {
    res.send('success');
  });

  // var user = new User;

  // user.lines.push({ text: req.body.line });
  // var subdoc = user.lines[0];
  // console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
  // subdoc.isNew; // true

  // user.save(function (err, data) {
  //   if (err) { console.log(err); } 
  //   console.log(data);
  //   res.redirect('/');
  // });


  // line.save(function (err, data) { 
  //     if (err){
  //         console.log(err);
  //         return res.redirect(303, 'error');
  //     }
  //     res.redirect(303, '../');
  //     console.log(data); 
  // });
});

module.exports = router;
