// Node Dependencies
var express = require('express');
var app = express.Router();
var path = require('path');
var request = require('request'); 
var cheerio = require('cheerio');

var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

//ROUTES
//===================================

// // Index Page Render (first visit to the site)
// router.get('/', function (req, res){
// 	res.redirect('/scrape');
// });

//A GET request to scrape the NY TImes world news website.
//Web scrape
app.get('/scrape', function(req, res) {
	//Grab the body of the HTML with request
	request('https://www.nytimes.com/section/world', function(err, res, html) {
		//Load into cheerio and save it to $ for shorthand
		var $ = cheerio.load(html);
		// var titles = [];
		//Grab every headline within an article tag
		$('h2 .headline').each(function(i, element) {
			//Save an empty result object
			var result = {};
			//Collect article title
			result.title = $(this).children('a').text().trim();
			//Collect article link
			result.link = $(this).children('a').attr('href').trim();
			// //Collect article summary
			// result.summary = $(this).children('div').text().trim()+ "";
			
			//Create a new entry and pass the result object to the entry			
			var entry = new Article(result);

			//Save the entry to the db
			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});

		});
	});
	res.send("Scrape complete!");
});

//Get articles scraped from the mongoDB
app.get("/articles", function(req, res) {
	Article.find({}, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

//Render Articles
// app.get('/articles', function(req, res) {
// 	//Sort in descending order, populate with comments and send to handlebars template.
// 	Article.find().sort({id:-1}).populate('comments').exec(function(err, doc) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			var hbsObject = {articles: doc};
// 			res.render('index', hbsObject);
// 		}
// 	});
// });

//Route to Grab an article by it's ObjectId
//===========================================================
app.get("/articles/:id", function(req, res) {
	//use id passed in as the id param, and write query to find the matching on in the db
	Article.findOne({"_id": req.params.id})
	//populate all of the comments associated with it
	.populate("comments")
	//execute the query
	.exec(function(err, doc) {
		//Log errors
		if (err) {
			console.log(err);
		//Otherwise, send the doc to the browser as a JSON object	
		} else {
			res.json(doc);
		}
	});
});



//Route to add a comment
//=========================================================================
app.post('/add/comment/:id', function(req, res) {

	//Create a new entry and pass in the req.body 
	var entry = new Comment(req.body);

	// var articleId = req.params.id;
	// var commentAuthor = req.body.name;
	// var commentContent = req.body.comment;
	// var result = {
	// 	author: commentAuthor,
	// 	content: commentContent
	// };

	
	//Save the new entry to the db
	entry.save(function(err, doc) {
		//Log errors
		if (err) {
			console.log("Error: " + err);
		} else {
			//Find the article id to find and update its comment
			Article.findOneAndUpdate({'_id:': req.params.id}, {"comment": doc._id})
			//Execute the above query
			.exec(function(err, doc) {
				//Log errors
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}

			});
		}
	});
});



//=========================================================================
//Need to add a Delete Comment route
//=========================================================================

// app.delete('delete/comment/:id', function (req, res){

// }) 


//Export router to server.js
module.exports = app;	









