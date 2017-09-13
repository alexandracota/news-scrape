//Node dependencies
var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema ({
	//Article title
	title: {
		type: String
	},
	//Article link
	link: {
		type: String
	},
	//Article summary
	summary: {
		type: String
	},
	//Article updated at
	updated: {
		type: String,
		default: moment().format('MMMM Do YYYY, h:mm A')
	},
	// Create a relation with the Comment model
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

// Create the Article model with Mongoose
var Article = mongoose.model('Article', articleSchema);



module.exports = Article;