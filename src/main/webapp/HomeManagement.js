let userAlbum, otherAlbum, albumCreationForm, selectedAlbum, selectedImage,
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

function AllAlbumToShow()
{
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
				self.updateAlbum(userAlbumToShow);
				self.updateAlbum(otherAlbumToShow);
				self.createAddAlbumForm(imageUserToShow);
			}
			else if (req.status == 403)
			{
				window.location.href = "index.html";
				windows.sessionStorage.removeItem('username');
			}
		}, true);
	}
	
	this.updateAlbum = function(albumToShow)
	{
		
	}
	
	this.createAddAlbumForm(imageToShow)
	{
		
	}
}




function PageOrchestrator()
{
	//initi the different parts of the page
	this.start = function(){
	allAlbumToShow = new AllAlbumToShow();
	userAlbum = new UserAlbum()
	otherAlbum = new OtherAlbum()
	// i want to retrieve al the information from the selectedAlbum
	albumCreationForm = new albumCreationForm()
	selectedAlbum = new SelectedImage()
	}
	
	this.refresh = function(){
		
	}
	
}

function UserAlbum()
{
	makeCall("GET", "")
}

