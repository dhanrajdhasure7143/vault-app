function signOut() {
    firebase.auth().signOut().then(function () {
        console.log("Signed out");
        displayNotification("Logged Out!!")
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('file-upload').style.display = 'none';
    }).catch(function (error) {
        displayNotification(error.message)

    });
}


function toggleForm(formId) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
}

function login() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;
            displayNotification("Login Successful..");

            localStorage.setItem('users-mail', user.email)
            console.log('Logged in email Id :', localStorage.getItem('users-mail'));

            var namedElement = document.getElementById('named');
            if (namedElement) {
                namedElement.innerHTML = localStorage.getItem('users-mail');
            } else {
                displayNotification("Element with ID 'named' not found!");
            }
            document.getElementById('file-upload').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Login error:', errorCode, errorMessage);
            displayNotification('Login failed, plz try again!')
        });
}

function signup() {
    var name = document.getElementById('signup-name').value;
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;
            localStorage.setItem('users-mail', user.email)
            console.log('Signed up:', user);
            displayNotification('Signup done!')
            document.getElementById('file-upload').style.display = 'block';
            document.getElementById('signup-form').style.display = 'none';
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            displayNotification(error.message)
        });
}

function displayNotification(message) {
    var notificationOverlay = document.getElementById("notification-overlay");
    notificationOverlay.textContent = message;
    notificationOverlay.classList.add("show");

    setTimeout(function () {
        notificationOverlay.classList.remove("show");
    }, 3000);
}

