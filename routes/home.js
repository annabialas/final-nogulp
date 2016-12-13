var express = require('express');
var router = express.Router();

var User = require('../models/user');

function isAuthenticated(req, res, next) {

    if (req.user) {
        return next();
    }

    res.redirect('/');
};

function isNotAuthenticated(req, res, next) {

    if (!req.user) {
        return next();
    }

    res.redirect('/home');
};



router.get('/', isNotAuthenticated, function(req, res){
    res.render('index');
});

router.get('/home', isAuthenticated, function(req, res){

  res.locals.title = 'Home';

  var query = {};

  User.find(query, function(err, data){
    var pageData = {
      users: data
    };

    res.render('home', pageData);
  });
});

module.exports = router;