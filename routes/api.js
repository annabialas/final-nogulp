var express = require('express');
var router = express.Router();

var User = require('../models/user');

function isAuthenticated(req, res, next) {

    if (req.user) {
        return next();
    }

    res.redirect('../login');
}

router.get('/', isAuthenticated, function(req, res){

    // var query = {};

    // if (req.query.q) {
    //  query = { line: req.query.q };
    // };

    var re = new RegExp(req.query.q, 'i');
                                      
    User.find(
     // { lines: { $elemMatch: { text: {$in: [req.query.line]} } } }, // the $in method did not work for me completely; returned the values only when query matched the entire string
      { lines: { $elemMatch: { text: { $regex : re } } } }, 
      function(err, data) {
        if (err) {
          res.status(500);
          return res.json({
            status: 'error', 
            message: 'Could not get fears.'
          });
        };
        if (data.length === 0) {
          return res.render('api', {
              flash: {
                body: 'There are no fears matching your criteria.'
              }
          });
        };
        // if (req.query.q == '') {
        //   return res.render('api')
        // }; // boop, how do I NOT display all results on no query????
        var pageData = {
          users: data
        };
        // why does this return all of particular user's lines..
        res.render('api', pageData);

      });
   
});

router.get('/lines', isAuthenticated, function(req, res){

  // var query = {};

  // if (req.query.line) {
  //  query = { line: req.query.line };
  // };

  var re = new RegExp(req.query.line, 'i');
                                      
  User.find(
   // { lines: { $elemMatch: { text: {$in: [req.query.line]} } } }, // the $in method did not work for me completely; returned the values only when query matched the entire string
    { lines: { $elemMatch: { text: { $regex : re } } } }, 
    function(err, data) {
      if (err) {
        res.status(500);
        return res.json({
          status: 'error', 
          message: 'could not get lines'
        });
      };
      if (data.length === 0) {
        return res.json({
          status: 'there are no lines matching your criteria', 
        });
      };
      console.log(data);
      return res.json(data);
    });

});

router.delete('/lines/:id', isAuthenticated, function(req, res){

  // User.findOneAndUpdate(req.user._id, {
  //  $pull: { lines: { _id: req.params.id }}
  // }, {"new": true}, function(err, doc){
  //     if (err) {
  //     console.log(err);
  //     }
  //     res.send('deleted!')
  // }); // THIS DID NOT WORK, RUDE

  User.findById(req.user._id).then(function(user) {

      console.log(user._id)

      user.lines.forEach(function(line) {
          if (line._id == req.params.id) {
            var index = user.lines.indexOf(line);
            user.lines.splice(index, 1);
            user.save();
            res.send(user);
          }
      });

  });

});

module.exports = router;
