//in this way the variables end up in the global scope add curly braces to prevent this
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

//TODO can be converted to a class declaration
function AllAlbumToShow(alert, userAlbumContainer, otherAlbumContainer, addAlbumForm, orchestrator)
{
	//this attributes will be initi when thhe pageOrchestrator calls stars on itself
	//can i call the attributes without usign the orchestrator?
	this.alert = alert;
	this.userAlbum = userAlbumContainer;
	this.otherAlbum = otherAlbumContainer;
	this.addAlbumForm = addAlbumForm;
	this.orchestrator = orchestrator;
	
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
		//TODO add the logic to add the userAlbum
	}
	
	this.createAddAlbumForm(imageToShow)
	{
		//TODO add the logic to add the albumForm
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

