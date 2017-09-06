//Node dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request'); //for web scraping
var cheerio = require('cheerio');//for webscraping

//Create instance of express
var app = express();

//Initialize body parser
app.use(bodyParser.urlencoded({
  extended: false
}))

// Serve Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Configuration with Mongoose
//========================================================================
var db = mongoose.connection;

if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_ftj5vmzd:36rlqt1j82aak1c83324arubk0@ds129144.mlab.com:29144/heroku_ftj5vmzd');
} else {
	mongoose.connect('mongodb://localhost/news-scrape')
};

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// // Import the Comment and Article models
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');

// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);


// Launch App
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});