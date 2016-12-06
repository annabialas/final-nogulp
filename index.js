// load modules
var express = require('express');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

// load .env
require('dotenv').config();

// create app
var app = express();
var PORT = process.env.PORT || 8080;

// set cookieSecret in .env
app.use(session({
    secret: process.env.cookieSecret,
    name: 'login',
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

// init handlebars
app.engine('handlebars', hbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

// add form fields to req.body, i.e. req.body.username
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connect to database
mongoose.connect(process.env.DB_URL);

var options = {};
var auth = require('./lib/auth')(app, options);
auth.init(); // setup middleware
auth.registerRoutes();

app.use(express.static('public'));

// home page
app.get('/', function(req, res) {
	res.render('index');
});

// var renderViews = require('./routes/views');
// app.use('/', renderViews);

// start server
app.listen(PORT, function() {
  console.log('listening on port ', PORT);
});
