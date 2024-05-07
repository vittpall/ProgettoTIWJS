/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    var form = e.target.closest("form");
    if (form.checkValidity()) {
      makeCall("POST", 'CheckLogin', e.target.closest("form"),
        function(x) {
          if (x.readyState == XMLHttpRequest.DONE) {
            var message = x.responseText;
            switch (x.status) {
              case 200:
            	sessionStorage.setItem('username', message);
				console.log(message)
                window.location.href = "Home.html";
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
    } else {
    	 form.reportValidity();
    }
  });

})();