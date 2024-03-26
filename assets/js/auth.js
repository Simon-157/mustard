// Login form
$('#login-form').submit(function(event) {
  event.preventDefault();
  var email = $('#email').val();
  var password = $('#password').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user) {
      // Handle successful login
      console.log("Logged in successfully!");
      localStorage.setItem("userId", user.uid);
       window.location.href = "/createblog.html";
    })
    .catch(function(error) {
      // Handle errors
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorMessage);
    });
});

// Register form
$('#register-form').submit(function(event) {
  event.preventDefault();
  var email = $('#register-email').val();
  var password = $('#register-password').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      // Handle successful registration
      console.log("Registered successfully!, ", firebase.auth().currentUser);
        window.location.href = "/createblog.html";

    })
    .catch(function(error) {
      // Handle errors
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorMessage);
    });
});

// Toggle between login and register forms
$('#toggle-register').click(function() {
  $('#login-form').hide();
  $('#register-form').show();
});

$('#toggle-login').click(function() {
  $('#login-form').show();
  $('#register-form').hide();
});

$('.logout').click(function() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    localStorage.removeItem('userId');
    window.location.href = "/auth.html";
  }).catch(function(error) {
    alert("Could not sign you out");
    console.error(error);
  });
});

// todo: then change the logout to login both the text and the icon
if(!localStorage.getItem('userId')){
  $('.logout').text("Login");
  $('.logout').prepend('<i class="fas fa-sign-in-alt"></i> ');
  $('.logout').attr("href", "/auth.html");

}


