// // Sign Up
// function signUp(email, password) {
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//         .then(function(userCredential) {
//             // Signed up successfully
//             var user = userCredential.user;
//             console.log("Signed up:", user);
//             // You can perform additional tasks after successful signup if needed
//         })
//         .catch(function(error) {
//             // Handle sign up errors
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             console.error("Sign up error:", errorCode, errorMessage);
//         });
// }

// // Sign In
// function signIn(email, password) {
//     firebase.auth().signInWithEmailAndPassword(email, password)
//         .then(function(userCredential) {
//             // Signed in successfully
//             var user = userCredential.user;
//             console.log("Signed in:", user);
//             // You can redirect the user to the main page or perform additional tasks after successful sign in
//         })
//         .catch(function(error) {
//             // Handle sign in errors
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             console.error("Sign in error:", errorCode, errorMessage);
//         });
// }

// Sign Out
function signOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful
        console.log("Signed out");
        displayNotification("Signed Out!!")
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('file-upload').style.display = 'none';
        // You can redirect the user to the login page or perform additional tasks after sign out
    }).catch(function(error) {
        // An error happened
        console.error("Sign out error:", error);
    });
}


// Function to toggle between login and signup forms
function toggleForm(formId) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
}

// Function to handle user login
function login() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // Login successful
            var user = userCredential.user;
            console.log('Logged in:', user);
            // Show file upload section
            document.getElementById('file-upload').style.display = 'block';
            // Hide login form
            document.getElementById('login-form').style.display = 'none';
        })
        .catch(function(error) {
            // Handle login errors
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Login error:', errorCode, errorMessage);
            alert(errorMessage);
        });
}

// Function to handle user signup
function signup() {
    var name = document.getElementById('signup-name').value;
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // Signup successful
            var user = userCredential.user;
            console.log('Signed up:', user);
            displayNotification('Signup done!')
            // Show file upload section
            document.getElementById('file-upload').style.display = 'block';
            // Hide signup form
            document.getElementById('signup-form').style.display = 'none';
        })
        .catch(function(error) {
            // Handle signup errors
            var errorCode = error.code;
            var errorMessage = error.message;
            displayNotification('Signup error: '. errorMessage)
            console.error('Signup error:', errorCode, errorMessage);
            alert(errorMessage);
        });
}

// Function to display notification
function displayNotification(message) {
    var notificationOverlay = document.getElementById("notification-overlay");
    notificationOverlay.textContent = message;
    notificationOverlay.classList.add("show");

    // Hide the notification after a certain time (e.g., 5 seconds)
    setTimeout(function() {
        notificationOverlay.classList.remove("show");
    }, 2000); // Adjust the time as needed (in milliseconds)
}

