var express = require('express');
var router = express.Router();

var User = require('../models/user');


router.get('/lines', function(req, res){

  var query = {};

  if (req.query.line) {
   query = { line: req.query.line };
  };

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

      return res.json(data);
    });

});

router.delete('/lines/:id', function(req, res){

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