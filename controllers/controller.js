// Node Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping

// var Comment = require('../models/Comment.js');
// var Article = require('../models/Article.js');

// Index Page Render (first visit to the site)
router.get('/', function (req, res){
	res.redirect('/scrape');
});

//Render Articles
router.get('/articles', function(req, res) {
	//Sort in descending order, populate with comments and send to handlebars template.
	Article.find().sort({id:-1}).populate('comments').exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			var hbsObject = {articles: doc};
			res.render('index', hbsObject);
		}
	})
})

//Web scrape
router.get('/scrape', function(req, res) {
	request('https://www.nytimes.com/section/world', function(err, res, html) {
		var $ = cheerio.load(html);
		var titles = [];
		$('article, .headline').each(function(i, element) {
			var result = {};
			//Collect article title
			result.title = $(this).children('headline').children('h2').text().trim() + "";
			//Collect article link
			result.link = 'https://www.nytimes.com/section/world' + $(this).children('headline').children('h2').children('a').attr('href').trim();
			//Collect article summary
			result.summary = $(this).children('div').text().trim()+ "";

			if (result.title !== "" && result.summary !== "") {
				if (titles.indexOf(result.title) == -1) {
					titles.push(result.title);
					//Only add article to the database if it is not there already.
					Article.count({ title: result.title}, function (err, test) {
						if (test === 0 ) {
							var entry = new Article (result);
							entry.save(function(err, doc) {
								if (err) {
									console.log(err);
								} else {
									console.log(doc);
								}
							});
						}
					});
				} else {
					console.log('Error, article already saved to database.')
				}
			} else {
				console.log('Error, empty content');
			}
		res.redirect('articles/');
		});
	});
});

//=========================================================================
//Need to add a Add Comment route
//=========================================================================



//=========================================================================
//Need to add a Delete Comment route
//=========================================================================



//Export router to server.js
module.exports = router;	









