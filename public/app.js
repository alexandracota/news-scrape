$(document).ready(function() {

	// event.preventDefault();


	//When someone clicks scrape button
	$(".scrape").on("click", function() {
		$.ajax({
			method: "GET",
			url: "/scrape"
		})
		.done(function(err, data) {
			if (err) {
				console.log("Error loading: " + err);
			} else {
				$("#articles").append("<h4>" + data.title + "</h4><br><p>" + data.link + "</p>");
			}
		})
	})

	//Grab the articles as a JSON
	$.getJSON("/articles", function(data) {
		//Loop through each one
		for (var i = 0; i < data.length; i++) {
			//Display information on the page.
			$("#articles").append("<p data-id=" + data[i]._id + "")
		}
	});

	//When someone clicks an element with the comment id
	$('.p').on('click', function() {
		//save the class from the a tag
		var thisId = $(this).attr("data-id");

		//Make an ajax call for the Article
		$.ajax({
			method: "GET",
			url: "/articles" + thisId
		})
		.done(function(data) {
			console.log(data);
			//Grab the title of the article
			$("#comments").append("<h2>" + data.title + "</h2>");
			//An input to enter the new title
			$("#comments").append("<input id = 'titleinput' name='title' >");
			//A textarea to add a new comment body
			$("#comments").append("<textarea id='bodyinput' name='body''></textarea>");
			//A button to submit a new comment, with the id of the article saved to it
			$("#comments").append("<button data-id='" + data._id + "'id='savecomment'>Save Comment</button>");
			
			//If there is a note in the article
			if(data.comment) {
				//Place the title of the note in the title input
				$('#titleinput').val(data.comment.title);
				//Place the body of the note in the body textarea
				$('#bodyinput').val(data.comment.body);
			}
		});
	});

	//When you click the savecomment button
	$(document).on('click', '#savecomment', function() {
		//Grab the id associated with the article from the submit button
		var thisId = $(this).attr("data-id");

		//Run a POST request to change the comment, using what's entered in the inputs
		$.ajax({
			method: 'POST',
			url: '/articles/' + thisId,
			data: {
				//Value taken from the input
				title: $('#titleinput').val(),
				//Value taken from the note textarea
				body: $('#bodyinput').val()
			}
		})
		//Done function
		.done(function(err, data) {
			if (err) {
				console.log(err);
			} else {
				console.log(data);
				//Empty the comments section
				$('#comments').empty();
			}
		});
	//Remove the values entered in the input and textarea for comment entry	
	$("#titleinput").val("");
	$("#bodyinput").val("");
	});


	//=================================================================
	//Need to add event handler to delete comment
	//=================================================================
});