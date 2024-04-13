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


// Function to handle file upload
function uploadFile() {
    var fileInput = document.getElementById("file-input");
    var file = fileInput.files[0];

    // Check if a file is selected
    if (file) {
        // Upload file to Firebase Storage
        uploadFileToStorage(file)
            .then(function(snapshot) {
                // Get download URL of the uploaded file
                snapshot.ref.getDownloadURL()
                    .then(function(downloadURL) {
                        // Add file metadata to Firestore/Realtime Database
                        console.log("Current user:", firebase.auth().currentUser);

                        addFileMetadata(firebase.auth().currentUser.uid, file.name, downloadURL)
                            .then(function(docRef) {
                                displayNotification('File uploaded successfully!')
                                console.log("File uploaded and metadata added:", docRef.id);
                                // Reload file list after successful upload
                                displayFiles();
                            })
                            .catch(function(error) {
                                console.error("Error adding file metadata:", error);
                            });
                    })
                    .catch(function(error) {
                        console.error("Error getting download URL:", error);
                    });
            })
            .catch(function(error) {
                console.error("Error uploading file:", error);
            });
    } else {
        console.error("No file selected.");
    }
}


// Function to display user's files
function displayFiles() {
    var fileList = document.getElementById("file-list");
    var userId = firebase.auth().currentUser.uid;

    // Clear existing file list
    fileList.innerHTML = "";

    // Retrieve user's files from Firestore/Realtime Database
    // Function to get user's files from Firestore
    function getUserFiles(userId) {
        return firebase.firestore().collection("files")
            .where("userId", "==", userId)
            .get();
    }

}

function getUserFiles(userId) {
    return firebase.firestore().collection("files")
        .where("userId", "==", userId)
        .get();
}

// Event listener to refresh file list when page loads
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, display files
            displayFiles();
        } else {
            // No user is signed in, redirect to login page
            // window.location.replace("\login.html");
        }
    });
});

// Function to upload file to Firebase Storage
function uploadFileToStorage(file) {
    return new Promise((resolve, reject) => {
        // Reference to the storage service
        var storageRef = firebase.storage().ref();

        // Upload file to the storage bucket
        var fileRef = storageRef.child('files/' + file.name);
        var uploadTask = fileRef.put(file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            function(snapshot) {
                // Track upload progress
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                displayNotification('File Uplading : ',progress," %")
                console.log('Upload is ' + progress + '% done');
            },
            function(error) {
                // Handle unsuccessful uploads
                console.error('Error uploading file:', error);
                reject(error);
            },
            function() {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    resolve(uploadTask.snapshot);
                });
            }
        );
    });
}

function addFileMetadata(userId, fileName, downloadURL) {
    var db = firebase.firestore();
    return db.collection("files").add({
        userId: userId,
        fileName: fileName,
        downloadURL: downloadURL
    });
}

// Function to display user's files
// function displayFiles() {
//     var fileList = document.getElementById("file-list");
//     var userId = firebase.auth().currentUser.uid;

//     // Clear existing file list
//     fileList.innerHTML = "";

//     // Retrieve user's files from Firestore/Realtime Database
//     firebase.firestore().collection("files").where("userId", "==", userId)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 var fileData = doc.data();
//                 // Create file list item
//                 var listItem = document.createElement("li");
//                 listItem.textContent = fileData.fileName;
//                 // Append file list item to file list
//                 fileList.appendChild(listItem);
//             });
//         })
//         .catch(function(error) {
//             console.error("Error getting user files:", error);
//         });
// }


// Function to display user's files
function displayFiles() {
    var fileList = document.getElementById("file-list");
    var userId = firebase.auth().currentUser.uid;

    // Clear existing file list
    fileList.innerHTML = "";

    // Retrieve user's files from Firestore/Realtime Database
    firebase.firestore().collection("files").where("userId", "==", userId)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var fileData = doc.data();
                // Create a list item for the file
                var listItem = document.createElement("li");

                // Check the file type based on its extension
                var fileType = getFileType(fileData.fileName);

                // Create an appropriate element to display the file
                var fileElement;
                if (fileType === "image") {
                    fileElement = document.createElement("img");
                    fileElement.src = fileData.downloadURL;
                    fileElement.alt = fileData.fileName;
                } else if (fileType === "video") {
                    fileElement = document.createElement("video");
                    fileElement.src = fileData.downloadURL;
                    fileElement.controls = true;
                } else if (fileType === "pdf") {
                    fileElement = document.createElement("iframe");
                    fileElement.src = fileData.downloadURL;
                    fileElement.style.width = "100%";
                    fileElement.style.height = "400px"; // Adjust height as needed
                } else {
                    // Unsupported file type, just display a link
                    fileElement = document.createElement("a");
                    fileElement.href = fileData.downloadURL;
                    fileElement.textContent = fileData.fileName;
                }

                // Append the file element to the list item
                listItem.appendChild(fileElement);

                // Append the list item to the file list
                fileList.appendChild(listItem);
            });
        })
        .catch(function(error) {
            console.error("Error getting user files:", error);
        });
}

// Function to get file type based on its extension
function getFileType(fileName) {
    var extension = fileName.split(".").pop().toLowerCase();
    if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") {
        return "image";
    } else if (extension === "mp4" || extension === "webm" || extension === "ogg") {
        return "video";
    } else if (extension === "pdf") {
        return "pdf";
    } else {
        return "other";
    }
}

