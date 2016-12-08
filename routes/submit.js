var express = require('express');
var router = express.Router();
// var https = require('https');

var Line = require('../models/line');

router.get('/', function(req, res){
	res.locals.title = 'Submit';
	res.render('submit');
});

router.post('/', function(req, res){

  var line = new Line({
      text: req.body.line
  });


  line.save(function (err, data) { 
      if (err){
          console.log(err);
          return res.redirect(303, 'error');
      }
      res.redirect(303, '../');
      console.log(data); 
  });
});

module.exports = router;


// router.get('/', function(req, res){

// 	var query = {};
// 	if (req.query.animal) {
// 		query = {animal: req.query.animal};
// 	};

// 	Pet.find(query, function(err, data){
// 		var pageData = {
// 			pets: data
// 		};

// 		res.render('pets', pageData);
// 	});
// });
