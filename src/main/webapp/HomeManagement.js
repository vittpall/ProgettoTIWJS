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

function UserWelcomeMessage(username, usernameContainer)
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
				var userAlbumToShow, otherAlbumToShow, imageUserToShow;
				if(req.status == 200)
				{
					var responseData = JSON.parse(req.responseText);  // Ensure response is parsed as JSON
                	console.log("Response Data:", responseData);
					userAlbumToShow = responseData.userAlbumJson;
					otherAlbumToShow = responseData.otherUserAlbumJson;
					//imageUserToShow = responseData.imageUserJson;
				}
				self.updateAlbum(userAlbumToShow, self.userAlbum);
				self.updateAlbum(otherAlbumToShow, self.otherAlbum);
				self.showAlbumForm(false);
			}
			else if (req.status == 403)
			{
				window.location.href = "index.html";
				windows.sessionStorage.removeItem('username');
			}
		}, true);
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
		        var albumCreator = album.User_id;
		        anchor.addEventListener("click", function() {
		        	console.log("Album Creator:", album.User_id); 
					selectedAlbum.show(album.Title, album.User_id);
	        });
	
	        listItem.appendChild(anchor);
	
	        listContainer.appendChild(listItem);
	    });
	}

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
        makeCall('POST', 'CreateAlbum', this, function(req) {
            if (req.readyState === XMLHttpRequest.DONE) {
                var message = req.responseText;
                if (req.status === 200) {
                    console.log('Album created successfully');
                    allAlbumToShow.refreshAlbums(); // Refresh the list of albums
                } else {
                    alert('Error creating album: ' + message);
                }
            }
        });
    });
	
}

function SelectedAlbum()
{
	//var photos = {};
	this.show = function(albumTitle, albumCreator)
	{
		var self = this;
		//to retrieve all the album's images and comments related to the them
		makeCall("GET", "GoToAlbumPage?albumTitle=" + encodeURIComponent(albumTitle)+ "&albumCreator=" + encodeURIComponent(albumCreator), null,
		function(req)
		{
			if(req.readyState == 4)
			{
				var message = req.responseText;
				if(req.status == 200)
				{
					responseData = JSON.parse(req.responseText);
					console.log("Response Data:", responseData);
					
                    // Clear the photos object before populating it with new data
                    
					
				}
				self.update(responseData);
				
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
	    photoContainer.innerHTML = '';
	    commentsContainer.innerHTML = '';
		/*
	    for (let i = startIndex; i < startIndex + 5 && i < imagesCommentToShow.length; i++) {
	       	const image = imagesCommentToShow[i];
	        const photoElement = document.createElement('img');
            photoElement.src = image.System_Path;
            photoElement.classList.add('photo');
            photoElement.addEventListener('click', () => {
                displayComments(image.Image_Id);
            });
            photoContainer.appendChild(photoElement);
	        
	    } */
	    for (let key in imagesCommentToShow) {
            if (imagesCommentToShow.hasOwnProperty(key)) {
                const image = imagesCommentToShow[key];
                const photoElement = document.createElement('img');
                
                console.log(image.System_Path);
                photoElement.src = 'http://localhost:8080ProgettoTIWJS/Home.html' + image.System_Path;
                console.log(photoElement.src);
                photoElement.classList.add('photo');
                photoElement.addEventListener('click', () => {
                    displayComments(image.Image_Id);
                });
                photoContainer.appendChild(photoElement);
            }
        }
	
	    const prevButton = document.getElementById('prevButton');
	    const nextButton = document.getElementById('nextButton');
	    prevButton.disabled = startIndex === 0;
	   // nextButton.disabled = startIndex + 5 >= imagesCommentToShow.length;
	    nextButton.disabled = startIndex + 5 >= Object.keys(imagesCommentToShow).length;
	
	    prevButton.addEventListener('click', () => {
	        if (startIndex > 0) {
	           // displayPhotos(startIndex - 5);
	            self.update(imagesCommentToShow, startIndex - 5); // Use self.update to recursively call update function
	        }
	    });
	    nextButton.addEventListener('click', () => {
	        if (startIndex + 5 < Object.keys(imagesCommentToShow).length) {
	           // displayPhotos(startIndex + 5);
	            self.update(imagesCommentToShow, startIndex + 5); // Use self.update to recursively call update function
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
/*
function UserAlbum() {
    this.show = function() {
        var self = this;
        makeCall("GET", "GetUserAlbums", null, function(req) {
            if(req.readyState == 4) {
                var message = req.responseText;
                if(req.status == 200) {
                    var responseData = JSON.parse(req.responseText);
                    var userAlbums = responseData.userAlbums;
                    self.update(userAlbums);
                } else if (req.status == 403) {
                    window.location.href = "index.html";
                    window.sessionStorage.removeItem('username');
                }
            }
        });
    }

    this.update = function(albums) {
        var albumContainer = document.getElementById('userAlbumContainer');
        albumContainer.innerHTML = '';
        albums.forEach(function(album) {
            var listItem = document.createElement("li");
            var anchor = document.createElement("a");
            anchor.href = "#";
            anchor.textContent = album.title;
            anchor.setAttribute("albumTitle", album.title)
            anchor.addEventListener("click", function() {
                selectedAlbum.show(album.title);
            });

            listItem.appendChild(anchor);
            albumContainer.appendChild(listItem);
        });
    }
}

function OtherAlbum() {
	this.show = function() {
		var self = this;
		makeCall("GET", "GetOtherAlbums", null, function(req) {
			if(req.readyState == 4) {
				var message = req.responseText;
				if(req.status == 200) {
					var responseData = JSON.parse(req.responseText);
					var otherAlbums = responseData.otherAlbums;
					self.update(otherAlbums);
				} else if (req.status == 403) {
					window.location.href = "index.html";
					window.sessionStorage.removeItem('username');
				}
			}
		});
	}

	this.update = function(albums) {
		var albumContainer = document.getElementById('otherAlbumContainer');
		albumContainer.innerHTML = '';
		albums.forEach(function(album) {
			var listItem = document.createElement("li");
			var anchor = document.createElement("a");
			anchor.href = "#";
			anchor.textContent = album.title;
			anchor.setAttribute("albumTitle", album.title)
			anchor.addEventListener("click", function() {
				selectedAlbum.show(album.title);
			});

			listItem.appendChild(anchor);
			albumContainer.appendChild(listItem);
		});
	}
}
function OtherUserAlbum() {
    this.show = function() {
        var self = this;
        makeCall("GET", "GetOtherUserAlbums", null, function(req) {
            if(req.readyState == 4) {
                var message = req.responseText;
                if(req.status == 200) {
                    var responseData = JSON.parse(req.responseText);
                    var otherUserAlbums = responseData.otherUserAlbums;
                    self.update(otherUserAlbums);
                } else if (req.status == 403) {
                    window.location.href = "index.html";
                    window.sessionStorage.removeItem('username');
                }
            }
        });
    }

    this.update = function(albums) {
        var albumContainer = document.getElementById('otherAlbumContainer');
        albumContainer.innerHTML = '';
        albums.forEach(function(album) {
            var listItem = document.createElement("li");
            var anchor = document.createElement("a");
            anchor.href = "#";
            anchor.textContent = album.title;
            anchor.setAttribute("albumTitle", album.title)
            anchor.addEventListener("click", function() {
                selectedAlbum.show(album.title);
            });

            listItem.appendChild(anchor);
            albumContainer.appendChild(listItem);
        });
    }
}
*/