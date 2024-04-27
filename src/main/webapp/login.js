(function() {

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    var form = e.target.closest("form");
    if (form.checkValidity()) {	
      makeCall("POST", 'CheckLogin', e.target.closest("form"),
        function(x) {
          if (x.readyState == XMLHttpRequest.DONE) {
            var message = x.responseText;
            switch (x.status) {
              case 200://fine
            	sessionStorage.setItem('username', message);
                window.location.href = "Home.html";
                break;
              case 400://bad request
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