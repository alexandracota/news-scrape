var mongoose = require ('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	//Create author
	author: {
		type: String
	},
	//create content
	content: {
		type: String
	}
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;