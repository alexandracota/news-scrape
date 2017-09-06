// function displayResults(data) {
//   // Add to the table here...
// }

// $.getJSON("/all", function(data) {
//   // Call function to generate a table body
//   displayResults(data);
// });


$(document).ready(function() {
	event.preventDefault();
	//Event handler to create a comment
	$('.add-comment-button').on('click', function(){
		var articleId = $(this).data("id");
		var frmName = "form-add-" + articleId;
		var frm = $('#' + frmName);
		var baseURL = window.location.origin;
	
		//Ajax call to add comment
		$.ajax({
			url: baseURL + '/add/comment' + articleId,
			type: 'POST',
			data: frm.serialize()
		})
		.done(function() {
			location.reload();
		})
	});
	//=================================================================
	//Need to add event handler to delete comment
	//=================================================================
});