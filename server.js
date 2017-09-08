//Node dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require("morgan");

//For web scraping
var request = require('request'); 
var cheerio = require('cheerio');

// Import the Comment and Article models
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');

//Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Create instance of express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Serve Static Content
app.use(express.static('public'));

// // Set Express-Handlebars
// var exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

//Configuration with Mongoose
//========================================================================
var db = mongoose.connection;

if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_ftj5vmzd:36rlqt1j82aak1c83324arubk0@ds129144.mlab.com:29144/heroku_ftj5vmzd');
} else {
	mongoose.connect('mongodb://localhost/news-scrape')
};

//Show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

//Once logged in to the db through mongoose, log a sucess message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);


// Launch App
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});