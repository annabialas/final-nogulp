// load modules
var express = require('express');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

// load .env
require('dotenv').config({silent: true});

// create app
var app = express();
var PORT = process.env.PORT || 8080;

var User = require('./models/user');

// set cookieSecret in .env
app.use(session({
    secret: process.env.cookieSecret,
    name: 'xyz',
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: false,
    // add session store
    store: new MongoStore({
      url: process.env.DB_URL
    })
  }
));

// attach req.session.flash to res.locals
app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// init handlebars
app.engine('handlebars', hbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

// add form fields to req.body, i.e. req.body.username
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connect to database
mongoose.connect(process.env.DB_URL);

// auth 
var options = {};
var auth = require('./lib/auth')(app, options);
auth.init(); // setup middleware
auth.registerRoutes();

// serve static files from public folder
app.use(express.static('public'));

// routes
var renderHome = require('./routes/home');
app.use('/', renderHome);

var renderProfile = require('./routes/profile');
app.use('/profile', renderProfile);

var renderAPI = require('./routes/api');
app.use('/api', renderAPI);

var renderSubmit = require('./routes/submit');
app.use('/submit', renderSubmit);


// start server
app.listen(PORT, function() {
  console.log('listening on port ', PORT);
});
