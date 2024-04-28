//in this way the variables end up in the global scope add curly braces to prevent this
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

function userWelcomeMessage(username, usernameContainer)
{
	this.username = username;
	this.show = function()
	{
		usernameContainer.textContent = this.username + "'s albums";
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
				if(req.status == 200)
				{
					var responseData = JSON.parse(req.responseText);
					var userAlbumToShow = responseData.userAlbumJson;
					var otherAlbumToShow = responseData.imageUserJson;
					var imageUserToShow = responseData.otherUserAlbumJson;
				}
				self.updateAlbum(userAlbumToShow, this.userAlbum);
				self.updateAlbum(otherAlbumToShow, this.otherAlbum);
				self.showAlbumForm(imageUserToShow);
			}
			else if (req.status == 403)
			{
				window.location.href = "index.html";
				windows.sessionStorage.removeItem('username');
			}
		}, true);
	}
	
	this.updateAlbum = function(albumToShow, idListContainer)
	{
	    var listContainer = document.getElementById(idListContainer);
	        listContainer.innerHTML = "";
	
	
	    	albumToShow.forEach(function(album) {
	
		        var listItem = document.createElement("li");
		
		        var anchor = document.createElement("a");
		        anchor.href = "#"; 
		        anchor.textContent = album.title;
		        anchor.setAttribute("albumTitle", album.title)
		        anchor.addEventListener("click", function() {
					selectedAlbum.show(album.title);
	        });
	
	        listItem.appendChild(anchor);
	
	        listContainer.appendChild(listItem);
	    });
	}

	//we can reuse the function to cover the form just in case
	this.showAlbumForm(imageToShow, hide)
	{
		let albumForm = document.getElementById("albumCreationForm");
		if(hide)
			albumForm.style.visibility = "hidden";
		else
			albumForm.style.visibility = "visible";
	}
	
	//autoclick on the first album of the user
	//TODO to check if the lenght of userAlbum is higher than one, to be fired everytime and album is added
	this.autoclick = function(albumTitleToShow) {
	  	var e = new Event("click");
	  	var selector = "a[albumTitle" + albumTitleToShow + "]";
	    var anchorToClick = (albumTitleToShow) ? document.querySelector(selector) : this.userAlbum.querySelectorAll("a")[0];
	    if (anchorToClick) anchorToClick.dispatchEvent(e);
	}
	
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
							orchestrator.refresh(albumTitle);
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
	}
	
	
}

function selectedAlbum()
{
	this.show = function()
	{
		var self = this;
		//to retrieve all the album's images and comments related to the them
		makeCall("GET", "GoToAlbumPage", null,
		function(req)
		{
			if(req.readyState == 4)
			{
				var message = req.responseText;
				if(req.status == 200)
				{
					var responseData = JSON.parse(req.responseText);
					var albumCommentHashMap = responseData.albumCommentHashMap;
					
				}
				self.update(albumCommentHashMap, 0);
				
			} else if (req.status == 403)
			{
				window.location.href = "index.html";
				window.sessionStorage.removeItem('username');
			}	
		})
	}
	
	this.update = function(imagesCommentToShow, startIndex)
	{
	    const photoContainer = document.getElementById('photoContainer');
	    const commentsContainer = document.getElementById('commentsContainer');
	    const photoKeys = Object.keys(photos);
	    photoContainer.innerHTML = '';
	    commentsContainer.innerHTML = '';
	
	    for (let i = startIndex; i < startIndex + 5 && i < photoKeys.length; i++) {
	        const photoKey = photoKeys[i];
	        const photoElement = document.createElement('img');
	        photoElement.src = photoKey;
	        photoElement.classList.add('photo');
	        photoElement.addEventListener('click', () => {
	            displayComments(photoKey);
	        });
	        photoContainer.appendChild(photoElement);
	    }
	
	    const prevButton = document.getElementById('prevButton');
	    const nextButton = document.getElementById('nextButton');
	    prevButton.disabled = startIndex === 0;
	    nextButton.disabled = startIndex + 5 >= photoKeys.length;
	
	    prevButton.addEventListener('click', () => {
	        if (startIndex > 0) {
	            displayPhotos(startIndex - 5);
	        }
	    });
	    nextButton.addEventListener('click', () => {
	        if (startIndex + 5 < photoKeys.length) {
	            displayPhotos(startIndex + 5);
	        }
	    });
}

	// Function to display comments for a specific photo
	function displayComments(photoKey) {
	    const commentsContainer = document.getElementById('commentsContainer');
	    commentsContainer.innerHTML = '';
	    const comments = photos[photoKey];
	    const commentList = document.createElement('ul');
	    comments.forEach(comment => {
	        const listItem = document.createElement('li');
	        listItem.textContent = comment;
	        commentList.appendChild(listItem);
	    });
	    commentsContainer.appendChild(commentList);
	
	    const commentForm = document.createElement('form');
	    const commentInput = document.createElement('input');
	    commentInput.setAttribute('type', 'text');
	    commentInput.setAttribute('placeholder', 'Add a comment');
	    const addButton = document.createElement('button');
	    addButton.textContent = 'Add Comment';
	    addButton.addEventListener('click', () => {
	        const newComment = commentInput.value;
	        if (newComment.trim() !== '') {
	            comments.push(newComment);
	            displayComments(photoKey);
	            commentInput.value = '';
	        }
	    });
	    commentForm.appendChild(commentInput);
	    commentForm.appendChild(addButton);
	    commentsContainer.appendChild(commentForm);
	}
}
	

function PageOrchestrator()
{
	//initi the different parts of the page
	this.start = function(){
		allAlbumToShow = new AllAlbumToShow();
		allAlbumToShow.show();
		
		userAlbum = new UserAlbum()
		otherAlbum = new OtherAlbum()
		// i want to retrieve al the information from the selectedAlbum
		albumCreationForm = new albumCreationForm()
		selectedAlbum = new SelectedImage()
	}
	
	this.refresh = function(albumTitle){
		allAlbumToShow.show();
		allAlbumToShow.autoclick(albumTitle);
	}
	
}

function UserAlbum()
{
	makeCall("GET", "")
}

