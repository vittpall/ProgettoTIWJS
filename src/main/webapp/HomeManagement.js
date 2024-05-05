//in this way the variables end up in the global scope, add curly braces to prevent this
let userWelcomeMessage, allAlbumToShow, selectedAlbum, selectedImage,
pageOrchestrator = new PageOrchestrator();

window.addEventListener("load", () =>
{
	if(sessionStorage.getItem("username") == null)
	{
		window.location.href = "index.html";	
	}
	else
	{
		pageOrchestrator.start();
		pageOrchestrator.refresh();
	}
}, false);

function UserWelcomeMessage(username, usernameContainer)
{
	this.username = username;
	this.show = function()
	{
		usernameContainer.textContent =  "Welcome user:  " +  this.username ;
	}
}



//TODO can be converted to a class declaration
function AllAlbumToShow(alert, userAlbumContainer, otherAlbumContainer, addAlbumForm)
{
	//this attributes will be initi when thhe pageOrchestrator calls stars on itself
	//can i call the attributes without usign the orchestrator?
	this.alert = alert;
	this.userAlbum = userAlbumContainer;
	this.otherAlbum = otherAlbumContainer;
	this.addAlbumForm = addAlbumForm;
	
	this.reset = function()
	{
		this.userAlbum.style.visibility = "hidden";
		this.otherAlbum.style.visibility = "hidden";
		this.addAlbumForm.style.visibility = "hidden";
	}
	
	this.show = function()
	{
		var self = this //permits closure 
		makeCall("GET", "GoToHomePage", null, function(req)
		{
			if(req.readyState == 4)
			{	
				var userAlbumToShow, otherAlbumToShow, userImages;
				if(req.status == 200)
				{
					var responseData = JSON.parse(req.responseText);  // Ensure response is parsed as JSON
                	console.log("Response Data:", responseData);
					userAlbumToShow = responseData.userAlbumJson;
					otherAlbumToShow = responseData.otherUserAlbumJson;
					userImages = responseData.imageUserJson;
					//console.log(userImages);
					//imageUserToShow = responseData.imageUserJson;
				}
				console.log(otherAlbumToShow)
				self.updateAlbum(userAlbumToShow, self.userAlbum);
				self.updateOtherAlbum(otherAlbumToShow, self.otherAlbum);
				self.populateForm(userImages);
				self.showAlbumForm(false);
			}
			else if (req.status == 403)
			{
				window.location.href = "index.html";
				windows.sessionStorage.removeItem('username');
			}
		}, true);
	}
	
	this.populateForm =  function populateCheckboxes(options) {
	    var checkboxContainer = document.getElementById('checkboxContainer');
	    checkboxContainer.innerHTML = ''; // Clear previous checkboxes
	
	    options.forEach(option => {
	      var checkbox = document.createElement('input');
	      checkbox.type = 'checkbox';
	      checkbox.name = 'selectedImages';
	      checkbox.value = option.Image_Id;
	      checkbox.id = 'option_' + option.Image_Id;
	    
	
	      var label = document.createElement('label');
	      label.htmlFor = option.Title;
	      label.appendChild(document.createTextNode(option.Title));
	
	      checkboxContainer.appendChild(checkbox);
	      checkboxContainer.appendChild(label);
	      checkboxContainer.appendChild(document.createElement('br'));
	    });
  }

	 
	this.updateAlbum = function(albumToShow, listContainer)
	{
	  //  var listContainer = document.getElementById(idListContainer);
	  if (!Array.isArray(albumToShow) || albumToShow.length === 0) {
        console.log('No albums to display');
        listContainer.innerHTML = "<p>No albums available.</p>"; // Provide feedback
        return;
    	}
	        listContainer.innerHTML = "";
	
	
	    	albumToShow.forEach(function(album) {
	
		        var listItem = document.createElement("li");
		        var anchor = document.createElement("a");
		        anchor.href = "#"; 
		        anchor.textContent = album.Title;
		        anchor.setAttribute("albumTitle", album.Title);
		        anchor.addEventListener("click", function() {
		        	console.log("Album Creator:", album.User_id); 
					selectedAlbum.show(album.Title, album.User_id);
	        });
	
	        listItem.appendChild(anchor);
	
	        listContainer.appendChild(listItem);
	    });
	}
	
	this.updateOtherAlbum = function(userAlbumMap, listContainer) {
	    if (!userAlbumMap || userAlbumMap.size === 0) {
	        console.log('No albums to display');
	        listContainer.innerHTML = "<p>No albums available.</p>"; // Provide feedback
	        return;
	    }
	  
	    console.log(listContainer)
	    listContainer.innerHTML = "";
	
		for(var username in userAlbumMap)
		{
			var userHeader = document.createElement("h3");
	    	userHeader.textContent = username;
	    	listContainer.appendChild(userHeader);
	    	
	        userAlbumMap[username].forEach(function(album) {
	            var listItem = document.createElement("li");
	            var anchor = document.createElement("a");
	            anchor.href = "#";
	            anchor.textContent = album.Title;
	            anchor.setAttribute("albumTitle", album.Title);
	            anchor.addEventListener("click", function() {
	                console.log("Album Creator:", username);
	                selectedAlbum.show(album.Title, username);
	            });
	
	            listItem.appendChild(anchor);
	
	            listContainer.appendChild(listItem);
	    });
	    }

	};

	//we can reuse the function to cover the form just in case
	this.showAlbumForm = function(hide)
	{
		//console.log('hide value:', hide); 
		let albumForm = document.getElementById("albumCreationForm");
		albumForm.style.visibility = hide ? "hidden" : "visible";
	}
	
	//autoclick on the first album of the user
	//TODO to check if the lenght of userAlbum is higher than one, to be fired everytime and album is added
	this.autoclick = function(albumTitleToShow) {
	  	var e = new Event("click");
	  	var selector = "a[albumTitle" + albumTitleToShow + "]";
	    var anchorToClick = (albumTitleToShow) ? document.querySelector(selector) : this.userAlbum.querySelectorAll("a")[0];
	    if (anchorToClick) anchorToClick.dispatchEvent(e);
	}
	this.refreshAlbums = function() {
		
        this.show();
    }
    /*
	this.updateAfterNewAlbum = function(orchestrator)
	{
		this.addAlbumForm.querySelector("input[type='button']").addEventListener('click', (e) =>
		{
			var form = e.target.closest("form");
			if(form.checkValidity())
			{
				var self = this;
				makeCall("POST", 'CreateAlbum', form, function(req)
				{
					if(req.readyState == 4){
						var message = req.responseText;
						if(req.status == 200){
							//orchestrator.refresh(albumTitle);
							allAlbumToShow.refreshAlbums();
						}
						else if (req.status == 403)
						{
							window.location.href = "index.html";
							window.sessionStorage.removeItem('username');
						}
						else{
							self.alert.textContent = message;
						}
					}
				})
			}
			else{
				form.reportValidity();
			}
		})
	} */
	document.getElementById('createAlbumForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Use the makeCall utility to send a POST request with form data
    makeCall('POST', 'CreateAlbum', this, function(req) {
        if (req.readyState == 4) { // Check if the request has completed
            if (req.status == 200) {
                console.log('Album created successfully');
                allAlbumToShow.refreshAlbums(); // Refresh the list of albums
            } else if (req.status == 403) {
                window.location.href = "index.html";
                window.sessionStorage.removeItem('username');
            } else {
                alert('Error creating album: ' + req.responseText);
            }
        }
    });
});

	
}

function SelectedAlbum() {
	var currentAlbumTitle, currentImageId;
	this.show = function (albumTitle, albumCreator) {
		currentAlbumTitle = albumTitle;
		var self = this;
		// Hide album sections and show image details
		document.getElementById('albumSection').style.display = 'none';
		document.getElementById('imageDetailsSection').style.display = 'block';
		//to retrieve all the album's images and comments related to the them
		makeCall("GET", "GoToAlbumPage?albumTitle=" + encodeURIComponent(albumTitle) + "&albumCreator=" + encodeURIComponent(albumCreator), null,
			function (req) {
				if (req.readyState == 4) {
					var message = req.responseText;
					if (req.status == 200) {
						var responseData = JSON.parse(req.responseText);
						console.log("Response Data2:", responseData);
						self.update(responseData, 0); // Initial index 0 to start showing images from the beginning

					}
					
				} else if (req.status == 403) {
					window.location.href = "index.html";
					window.sessionStorage.removeItem('username');
				}
			})
	}

	this.update = function (imagesCommentToShow, startIndex) {
		const photoContainer = document.getElementById('photoContainer');
		photoContainer.innerHTML = '';
		for (let i = startIndex; i < startIndex + 5 && i < imagesCommentToShow.length; i++) {
			const image = imagesCommentToShow[i];
			const photoElement = document.createElement('img');
			currentImageId = image.Image_Id;  // Update current image ID
			photoElement.src = "/ProgettoTIWJS" + image.System_Path;
			console.log(photoElement.src);
			photoElement.classList.add('photo-thumbnail');
			//photoElement.onclick = () => this.showModal(image);
			photoElement.addEventListener("mouseover", () => this.showModal(image)); // Changed to 'mouseover'
			photoContainer.appendChild(photoElement);
		}

		const prevButton = document.getElementById('prevButton');
		const nextButton = document.getElementById('nextButton');
		prevButton.disabled = startIndex === 0;
		nextButton.disabled = startIndex + 5 >= imagesCommentToShow.length;

		prevButton.addEventListener('click', () => {
			if (startIndex > 0) {
			
				this.update(imagesCommentToShow, startIndex - 5);
			}
		});
		nextButton.addEventListener('click', () => {
			if (startIndex + 5 < imagesCommentToShow.length) {
			
				this.update(imagesCommentToShow, startIndex + 5);
			}
		});
	}

	this.showModal = function (image) {
		currentImageId = image.Image_Id;  // Update current image ID when modal is shown
		const modal = document.getElementById('imageModal');
		const modalImg = document.getElementById("img01");
		const captionText = document.getElementById("caption");
		const commentsContainer = document.getElementById('commentsContainer');

		modal.style.display = "block";
		modalImg.src = "/ProgettoTIWJS" + image.System_Path;
		captionText.innerHTML = `<strong>${image.Title}</strong>`;

		displayComments(image.Comments, currentAlbumTitle, image.Image_Id, image);
		//commentsContainer.style.display = "block";
		// Add event listener for close button
		var closeButton = document.querySelector('.close');
		closeButton.addEventListener('click', function () {
			selectedAlbum.closeModal();
		});
	};
	this.closeModal = function () {
		const modal = document.getElementById('imageModal');
		modal.style.display = "none";
		// Show album sections and hide image details
		document.getElementById('albumSection').style.display = 'none';
		document.getElementById('imageDetailsSection').style.display = 'block';
	};
}
    /*
	// Function to display comments for a specific photo
	function displayComments(comments, albumTitle, imageId, image) {
	    const commentsContainer = document.getElementById('commentsContainer');
	    commentsContainer.innerHTML = '';
	    if (!Array.isArray(comments)) {
        	comments = [];  // Ensure comments is an array, even if it's empty
    	}
	    const commentList = document.createElement('ul');
	    comments.forEach(comment => {
	        const listItem = document.createElement('li');
	        listItem.textContent = comment.Text;
	        commentList.appendChild(listItem);
	    });
	    commentsContainer.appendChild(commentList);
	    // Scroll to the bottom of the container to ensure the form is visible
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
	
	    const commentForm = document.createElement('form');
	    const commentInput = document.createElement('input');
	    commentInput.setAttribute('type', 'text');
	    commentInput.setAttribute('name', 'comment');  // Ensure the name attribute is set for proper FormData handling
	    commentInput.setAttribute('placeholder', 'Add a comment');
	    
	    // Input for album title, included even if hidden for future use
    	const albumTitleInput = document.createElement('input');
    	albumTitleInput.setAttribute('type', 'hidden');
    	albumTitleInput.setAttribute('name', 'albumTitle');
    	albumTitleInput.value = albumTitle;

    	// Input for image ID
    	const imageIdInput = document.createElement('input');
    	imageIdInput.setAttribute('type', 'hidden');
    	imageIdInput.setAttribute('name', 'imageId');
    	imageIdInput.value = imageId;
    	console.log("Image ID Input Value:", imageIdInput.value);

	    const addButton = document.createElement('button');
	    addButton.textContent = 'Add Comment';
	    addButton.type = 'submit';

	    addButton.addEventListener('click', (event) => {
	        event.preventDefault();
	        const newComment = commentInput.value;
	        if (newComment === ''){
	        	alert('Comment cannot be empty!');
            return;
	        }
	        if (newComment.trim() !== '') {
            	commentForm.appendChild(albumTitleInput);
            	commentForm.appendChild(imageIdInput);
            	makeCall('POST', 'AddComment', commentForm, function(req) {
        		if (req.readyState === XMLHttpRequest.DONE) {
            		if (req.status === 200) {
                		const updatedComments = JSON.parse(req.responseText);
                		displayComments(updatedComments, albumTitle, imageId);  // Re-render comments
                		//selectedAlbum.refreshComments(updatedComments.comments); // Refresh comments using data returned from AddComment

                		commentInput.value = '';  // Clear the input field
            		} else {
                		alert("Failed to add comment: " + req.statusText);
            		}
        		}
    		}, false);  // Set 'reset' to false to not reset the form automatically

	        }
	    });
	    commentForm.appendChild(commentInput);
	    commentForm.appendChild(addButton);
	    commentsContainer.appendChild(commentForm);
	    
	} */
	function displayComments(comments, albumTitle, imageId, image) {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = ''; // Clear previous contents
    const commentList = document.createElement('ul');
	// Check if comments is actually an array
    if (!Array.isArray(comments)) {
        //console.error("Expected an array for comments, received:", comments);
        comments = []; // Ensure we have an array to avoid further errors, or handle this error appropriately
    }
    comments.forEach(comment => {
        const listItem = document.createElement('li');
        listItem.textContent = comment.Text;
        commentList.appendChild(listItem);
    });

    commentsContainer.appendChild(commentList);

    // Add the comment form
    const commentForm = createCommentForm(albumTitle, imageId);
    commentsContainer.appendChild(commentForm);

    // Scroll to the bottom of the container to ensure the form is visible
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
}

function createCommentForm(albumTitle, imageId) {
    const commentForm = document.createElement('form');
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.name = 'comment';
    commentInput.placeholder = 'Add a comment';
    
    const albumTitleInput = document.createElement('input');
    albumTitleInput.type = 'hidden';
    albumTitleInput.name = 'albumTitle';
    albumTitleInput.value = albumTitle;

    const imageIdInput = document.createElement('input');
    imageIdInput.type = 'hidden';
    imageIdInput.name = 'imageId';
    imageIdInput.value = imageId;

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Comment';
    addButton.type = 'submit';
    addButton.addEventListener('click', function(event) {
        event.preventDefault();
        handleAddComment(commentForm, commentInput, albumTitle, imageId);
    });

    commentForm.appendChild(commentInput);
    commentForm.appendChild(albumTitleInput);
    commentForm.appendChild(imageIdInput);
    commentForm.appendChild(addButton);

    return commentForm;
}

function handleAddComment(commentForm, commentInput, albumTitle, imageId) {
    const newComment = commentInput.value.trim();
    if (newComment === '') {
        alert('Comment cannot be empty!');
        return;
    }
    makeCall('POST', 'AddComment', commentForm, function(req) {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                const updatedComments = JSON.parse(req.responseText);
                displayComments(updatedComments, albumTitle, imageId);
                commentInput.value = '';  // Clear the input field
            } else {
                alert("Failed to add comment: " + req.statusText);
            }
        }
    }, false);
}


	

function PageOrchestrator()
{
	//initi the different parts of the page
	this.start = function(){
		userWelcomeMessage = new UserWelcomeMessage(sessionStorage.getItem('username'), document.getElementById('usernameContainer'));
        userWelcomeMessage.show();
		allAlbumToShow = new AllAlbumToShow(document.getElementById('alertContainer'), document.getElementById('userAlbumContainer'), document.getElementById('otherAlbumContainer'), document.getElementById('addAlbumForm'));
		allAlbumToShow.show();
		
	//	userAlbum = new UserAlbum();
	//	otherAlbum = new OtherAlbum();
		// i want to retrieve al the information from the selectedAlbum
	//	albumCreationForm = new albumCreationForm();
		selectedAlbum = new SelectedAlbum();


	}
	
	this.refresh = function(albumTitle){
		allAlbumToShow.show();
		allAlbumToShow.autoclick(albumTitle);
		allAlbumToShow.refreshAlbums();
	}
	
}
