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

// Index Page Render (first visit to the site)
app.get('/', function (req, res){
	res.redirect('/scrape');
});

//A GET request to scrape the NY TImes world news website.
//Web scrape
app.get('/scrape', function(req, res) {
	//Grab the body of the HTML with request
	request('https://www.nytimes.com/section/world', function(err, res, html) {


		//Load into cheerio and save it to $ for shorthand
		var $ = cheerio.load(html);
		// var titles = [];
		//Grab every headline within an article tag
		$('h2.headline').each(function(element) {

			console.log(element);
			//Save an empty result object
			var result = {};
			//Collect article title
			result.title = $(this).text();
			//Collect article link
			result.link = $(this).children('a.href');
			console.log($(this).text());
			// //Collect article summary
			// result.summary = $(this).children('div').text().trim()+ "";
			console.log(result.title);
			console.log(result.link);
			//Create a new Article and pass the result object to the newArticle			
			var newArticle = new Article(result);

			//Save the newArticle to the db
			newArticle.save(function(err, doc) {
				console.log(newArticle);
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
			res.send(doc);
		}
	});
});

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
			res.send(doc);
		}
	});
});



//Route to create a new comment or replace an existing comment
//=========================================================================
app.post('/articles/:id', function(req, res) {

	//Create a new comment and pass in the req.body 
	var newComment = new Comment(req.body);

	// var articleId = req.params.id;
	// var commentAuthor = req.body.name;
	// var commentContent = req.body.comment;
	// var result = {
	// 	author: commentAuthor,
	// 	content: commentContent
	// };

	
	//Save the new comment to the db
	newComment.save(function(err, doc) {
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









