/**
 * Registration management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("registrationButton").addEventListener('click', (e) => {
    var form = e.target.closest("form");
   
    // Check if the email syntax is valid
    var emailInput = form.querySelector('input[type="email"]');
    var email = emailInput.value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
     	document.getElementById("emailError").textContent = "Invalid email address";
    }
    else
    {
		document.getElementById("emailError").textContent = "";
	}
    
    // Check if the password matches
    var passwordInput = form.querySelector('input[name="password"]');
    var confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
    var password = passwordInput.value.trim();
    var confirmPassword = confirmPasswordInput.value.trim();
    console.log(password)
    if (password !== confirmPassword) {
      	document.getElementById("passwordError").textContent = "Passwords do not match";
    }
    else
    {
		document.getElementById("passwordError").textContent = "";
	}

    
    if (form.checkValidity()) {
      makeCall("POST", 'Register', e.target.closest("form"),
        function(x) {
          if (x.readyState == XMLHttpRequest.DONE) {
			var response = JSON.parse(x.responseText);	
            var message = response.responseText;
            var messagePwd = response.wrongEmailJson;
            var messageEmail = response.pswNotMatchJson;
            var messageUsername = response.usernameAlreadyTakenJson;
            var username = form.querySelector('input[name="username"]'); 
 
	
            switch (x.status) {
              case 200:
				  console.log("avanti")
            	sessionStorage.setItem('username', username);
                window.location.href = "index.html";
                break;
              case 400: // bad request

            	if(messageUsername != null)
            	{
					document.getElementById("usernameTaken").textContent = messageUsername;
					console.log("ciao")
				}
            		

                break;
                
              case 401: // unauthorized
                  document.getElementById("loginError").textContent = message;
                  break;
              case 500: // server error
            //	document.getElementById("loginError").textContent = message;
 
                break;
            
            }
          }
        }
      );
    } else {
    	 form.reportValidity();
    }
  });

})();