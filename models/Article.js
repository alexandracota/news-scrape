//Node dependencies
var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema ({
	//Article title
	title: {
		type: String,
		required: true
	},
	//Article link
	link: {
		type: String,
		required: true
	},
	//Article summary
	summary: {
		type: String,
		required: true
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