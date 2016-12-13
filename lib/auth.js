var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');

module.exports = function(app, options) {
  
  return {
    init: function() {

      passport.use( new LocalStrategy(User.authenticate()));

      passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          // handle err
          if (err || !user) {
            return done(err, null);
          }
          done(null, user);
        });
      });
      
      app.use(passport.initialize());
      app.use(passport.session());
      
      app.use(function(req, res, next) {
        // add user to res.locals
        // passport adds req.user
        // we can use res.locals.user in our views
        res.locals.user = req.user;
        next();
      });
    },
    
    registerRoutes: function() {

      function isNotAuthenticated(req, res, next) {

          if (!req.user) {
              return next();
          }

          res.redirect('/home');
      }

      app.get('/signup', isNotAuthenticated, function(req, res) {
        res.locals.title = 'Sign Up';
        res.render('signup')
      });

       app.post('/signup', function(req, res, next) {

        var newUser = new User({
          username: req.body.username
          
        });

        User.register(newUser, req.body.password, function(err, user) {
          if (err) {
            console.log('signup error', err);
            
            return res.render('signup', {
              flash: {
                header: 'Signup Error',
                body: err.message
              }
            });
          }

          // if success... 
          passport.authenticate('local')(req, res, function() {

            req.session.flash = {
              header: 'Successfully Registered',
              body: 'You signed up as ' + user.username
            };

            res.redirect('/home');
            
          });

        });
      });

      
      app.get('/login', isNotAuthenticated, function(req, res) {

        res.locals.title = 'Log In';
        res.render('login');

      });

      app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user) {
          // 500 error
          if (err) {
            return next(err);
          }
          // authentication failed
          if (! user) {
            return res.render('login', {
              flash: {
                header: 'Login Error',
                body: 'authentication failed'
              }
            });
          }
          req.login(user, loginErr => {
            if (loginErr) {
              return next(loginErr);
            }

            //success!!!
            req.session.flash = {
              header: 'Signed in',
              body: 'Welcome, ' + req.body.username
            };
            return res.redirect('/home');

          });      
        })(req, res, next);

      });

      app.get('/logout', function(req, res) {

        req.logout();

        req.session.destroy(function (err) {
          res.redirect('/');
        });
        

        // req.session.flash = {
        //   type: 'positive',
        //   header: 'Signed out',
        //   body: 'Successfully signed out'
        // };
        // res.redirect('/');
      });    
    }
  };
};