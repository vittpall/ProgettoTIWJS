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
					self.populateForm(userImages);
					//console.log(userImages);
					//imageUserToShow = responseData.imageUserJson;
				}
				console.log(otherAlbumToShow)
				//allImages = responseData.imageUserJson; // Assuming this is where images are fetched
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
		/*if (!Array.isArray(options)) {  // Check if options is an array
        	console.error("Expected an array for options, received:", options);
        	options = []; // Ensure we have an array to avoid further errors
        	checkboxContainer.textContent = 'No images available to display.';
        	return;  // Exit the function if no data to process
    	} */
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
					var newSelected = new SelectedAlbum();
					newSelected.show(album.Title, album.User_id);
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
	                var newSelected = new SelectedAlbum();
	                newSelected.show(album.Title, album.User_id);
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
	var currentAlbumTitle, currentImageId, albumCreator;
	
	this.show = function (albumTitle, albumCreator) {
		this.currentAlbumTitle = albumTitle;
		this.albumCreator = albumCreator;
		var self = this;
		// Update sessionStorage with current album creator
        sessionStorage.setItem('albumCreator', albumCreator);
        sessionStorage.setItem('currentAlbumTitle', albumTitle);
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
						imagesData = responseData; // Store the response data for later use
						console.log("Response Data2:", responseData);
						self.update(responseData, 0); // Initial index 0 to start showing images from the beginning
						unCoverBackToHomePage();
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
			photoElement.setAttribute('data-id', image.Image_Id); // Ensure each image has an ID for reordering
			console.log(photoElement.src);
			photoElement.classList.add('photo-thumbnail');
			//photoElement.onclick = () => this.showModal(image);
			photoElement.addEventListener("mouseover", () => this.showModal(image)); // Changed to 'mouseover'
			photoContainer.appendChild(photoElement);
		}
		// Update buttons visibility based on data length
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
	};
	
 
 this.showReorderView = function() {
    const listContainer = document.getElementById('photoContainer');
    listContainer.innerHTML = ''; // Clear current images

    // Map the current order from sessionStorage or default
    let imageOrder;
    const storedOrder = sessionStorage.getItem('customOrder' + currentAlbumTitle);
    console.log("storeOrder", storedOrder);
    if (storedOrder) {
        const storedOrderIds = JSON.parse(storedOrder);
        console.log("Stored Image IDs:", storedOrderIds);
        console.log("Check imagesData:", imagesData);
        imageOrder = storedOrderIds.map(id => imagesData.find(image => image.Image_Id.toString() === id.toString())).filter(image => image);
        console.log("Mapped Images:", imageOrder);
    } else {
        imageOrder = imagesData; // Default to initial full data set if no custom order set
    }

    console.log("Final Image Order:", imageOrder);

    imageOrder.forEach(image => {
        const listItem = document.createElement('div');
        listItem.textContent = image.Title; // Ensure titles are used
        listItem.setAttribute('data-id', image.Image_Id);
        listItem.classList.add('sortable-item');
        listContainer.appendChild(listItem);
    });

    Sortable.create(listContainer, {
        animation: 150,
        store: {
            set: function(sortable) {
                var order = sortable.toArray();
                sessionStorage.setItem('customOrder' + currentAlbumTitle, JSON.stringify(order));
            }
        }
    });

    document.getElementById('saveOrderButton').style.display = 'block';
};


   

    
 	this.saveNewOrder = function() {
    const order = JSON.parse(sessionStorage.getItem('customOrder' + currentAlbumTitle));
    if (!order || order.length === 0) {
        alert('Order is empty or not defined.');
        return;
    }
    console.log("Order to be saved:", order); 
    const form = document.createElement('form');
    form.style.display = 'none'; // Hide the form, it's not needed to be shown
	var franco = sessionStorage.getItem("currentAlbumTitle");
	console.log(franco);
    // Create hidden input for album title
    var inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'hidden');
    inputTitle.setAttribute('name', 'albumTitle');
    inputTitle.setAttribute('value', franco);
    console.log(currentAlbumTitle);
    console.log(this.currentAlbumTitle);
    form.appendChild(inputTitle);

    // Create hidden input for the order, need to stringify since it's an array
    var inputOrder = document.createElement('input');
    inputOrder.setAttribute('type', 'hidden');
    inputOrder.setAttribute('name', 'order');
    inputOrder.setAttribute('value', JSON.stringify(order)); // Ensure the order is a stringified array
    form.appendChild(inputOrder);

    // Append form to body to make FormData work correctly
    document.body.appendChild(form);

    // Call makeCall with the form
    makeCall("POST", "SaveImageOrder", form, function(response) {
    if (response.readyState === XMLHttpRequest.DONE) {
        if (response.status === 200) {
            alert('Order saved successfully');
          //  sessionStorage.setItem('customOrder' + currentAlbumTitle, JSON.stringify(order));  // Update session storage only on successful save
          //  selectedAlbum.showReorderView();
           
        } else {
            try {
                const data = JSON.parse(response.responseText);
                alert('Error saving order: ' + data.message);
            } catch (error) {
                alert('Error parsing error response: ' + error);
            }
        }
    }
}, false);


    // Clean up by removing the form after the request
   // document.body.removeChild(form);
};






	this.showModal = function (image) {
		currentImageId = image.Image_Id;  // Update current image ID when modal is shown
		const modal = document.getElementById('imageModal');
		const modalImg = document.getElementById("img01");
		const captionText = document.getElementById("caption");
		const commentsContainer = document.getElementById('commentsContainer');

		modal.style.display = "block";
		modalImg.src = "/ProgettoTIWJS" + image.System_Path;
		captionText.innerHTML = `<strong>${image.Title}</strong>`;
		captionText.innerHTML = `<strong>${image.Description}</strong>`;
		console.log(image);
		displayComments(image.Comments || [], currentAlbumTitle, image.Image_Id, this.albumCreator);
		console.log(image.Comments);
		
		
		
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

	function displayComments(comments, albumTitle, imageId, albumCreator) {
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
	console.log("riaggiorno i commenti");
    // Add the comment form
    const commentForm = createCommentForm(albumTitle, imageId, albumCreator);
    commentsContainer.appendChild(commentForm);

    // Scroll to the bottom of the container to ensure the form is visible
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
}

function createCommentForm(albumTitle, imageId, albumCreator) {
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
    
    console.log("utente"+sessionStorage.getItem("username"));
    console.log(albumCreator)
    if(albumCreator == sessionStorage.getItem("username"))
    {
		console.log("bottone per cancellare")
		var removeImageCommentButton = document.createElement('button');
    	removeImageCommentButton.textContent = 'Remove Image';
    	removeImageCommentButton.type = 'submit';
    	removeImageCommentButton.addEventListener("click", function(){
			console.log("cancella commento")
			handleRemoveImage(albumTitle, imageId);
		})
	}
 

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Comment';
    addButton.type = 'submit';
    addButton.addEventListener('click', function(event) {
        event.preventDefault();
        handleAddComment(commentForm, commentInput, albumTitle, imageId, albumCreator);
    });

    commentForm.appendChild(commentInput);
    commentForm.appendChild(albumTitleInput);
    commentForm.appendChild(imageIdInput);
    commentForm.appendChild(addButton);
    if(albumCreator == sessionStorage.getItem("username"))
    	commentForm.appendChild(removeImageCommentButton);

    return commentForm;
}

function handleRemoveImage(albumTitle, imageId)
{
			makeCall('GET', "AddComment?albumTitle=" + encodeURIComponent(albumTitle) + "&imageId=" + encodeURIComponent(imageId), null,
			function (req) {
				if (req.readyState == 4) {
					var message = req.responseText;
					if (req.status == 200) {
						selectedAlbum.show(albumTitle, sessionStorage.getItem("albumCreator"));
						selectedAlbum.closeModal();
						allAlbumToShow.show();
					}
					
				} else if (req.status == 403) {
					window.location.href = "index.html";
					window.sessionStorage.removeItem('username');
				}
			}, false)
}

function handleAddComment(commentForm, commentInput, albumTitle, imageId, albumCreator) {
    const newComment = commentInput.value.trim();
    if (newComment === '') {
        alert('Comment cannot be empty!');
        return;
    }
    makeCall('POST', 'AddComment', commentForm, function(req) {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                const updatedComments = JSON.parse(req.responseText);
                console.log(updatedComments);
               // updateImageComments(imageId, updatedComments);
               // const image = findImageById(imageId);
                displayComments(updatedComments, albumTitle, imageId, albumCreator);
                commentInput.value = '';  // Clear the input field
                // Refresh the album details to simulate coming from selecting an album
                //selectedAlbum.show(albumTitle, sessionStorage.getItem('albumCreator'));
            } else {
                alert("Failed to add comment: " + req.statusText);
            }
        }
    }, true);
}
/*
function updateImageComments(imageId, newComments) {
    const image = findImageById(imageId);
    if (image) {
        image.Comments = newComments;
    }
}
function findImageById(imageId) {
    return allImages.find(img => img.Image_Id === parseInt(imageId));
}
*/

function backToHomePage(){
	document.getElementById("backToHomePage").addEventListener("click", () =>
	{
			console.log("ciao");
			document.getElementById("imageDetailsSection").style.display = "none";
			document.getElementById("albumSection").style.display = "block";
			document.getElementById("backToHomePage").style.display = "none";
	})
}


function unCoverBackToHomePage(){

		document.getElementById("backToHomePage").style.display = "block";	

}

function logout(){
	//synch call to logout servlet
	    document.getElementById("logoutLink").addEventListener('click', () => {
	         makeCall("GET", 'Logout',null,
        		function(x) {
          			if (x.readyState == XMLHttpRequest.DONE) {
           			var message = x.responseText;
            		switch (x.status) {
              			case 200:
            			sessionStorage.removeItem('username', message);
                		window.location.href = "index.html";
                	break;
              		case 400: // bad request
                		document.getElementById("loginError").textContent = message;
                	break;
              		case 401: // unauthorized
                  		document.getElementById("loginError").textContent = message;
                  	break;
              			case 500: // server error
            			document.getElementById("loginError").textContent = message;
                	break;
            	}
          	}
        	}
        	);
        })
	     
};

	

function PageOrchestrator()
{
	//initi the different parts of the page
	this.start = function(){
		userWelcomeMessage = new UserWelcomeMessage(sessionStorage.getItem('username'), document.getElementById('usernameContainer'));
        userWelcomeMessage.show();
		allAlbumToShow = new AllAlbumToShow(document.getElementById('alertContainer'), document.getElementById('userAlbumContainer'), document.getElementById('otherAlbumContainer'), document.getElementById('addAlbumForm'));
		allAlbumToShow.show();
		backToHomePage();
		logout();

		
	//	userAlbum = new UserAlbum();
	//	otherAlbum = new OtherAlbum();
		// i want to retrieve al the information from the selectedAlbum
	//	albumCreationForm = new albumCreationForm();
		selectedAlbum = new SelectedAlbum();


	}
	
	this.refresh = function(albumTitle){
		allAlbumToShow.show();
	//	allAlbumToShow.autoclick(albumTitle);
		allAlbumToShow.refreshAlbums();
	}
	
}
	document.getElementById('reorderButton').addEventListener('click', function() {
    selectedAlbum.showReorderView();
});

document.getElementById('saveOrderButton').addEventListener('click', function() {
    selectedAlbum.saveNewOrder();
});
