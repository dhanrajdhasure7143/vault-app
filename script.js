function displayNotification(message) {
    var notificationOverlay = document.getElementById("notification-overlay");
    notificationOverlay.textContent = message;
    notificationOverlay.classList.add("show");

    setTimeout(function() {
        notificationOverlay.classList.remove("show");
    }, 2000); 
}


function uploadFile() {
    var fileInput = document.getElementById("file-input");
    var file = fileInput.files[0];

    if (file) {
        uploadFileToStorage(file)
            .then(function(snapshot) {
                snapshot.ref.getDownloadURL()
                    .then(function(downloadURL) {
                        console.log("Current user:", firebase.auth().currentUser);

                        addFileMetadata(firebase.auth().currentUser.uid, file.name, downloadURL)
                            .then(function(docRef) {
                                displayNotification('File uploaded successfully!')
                                console.log("File uploaded and metadata added:", docRef.id);
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
        displayNotification('Please select the File!')
    }
}


function displayFiles() {
    var fileList = document.getElementById("file-list");
    var userId = firebase.auth().currentUser.uid;t
    fileList.innerHTML = "";

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

document.addEventListener("DOMContentLoaded", function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            displayFiles();
        } else {
           
        }
    });
});

function uploadFileToStorage(file) {
    return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref();

        var fileRef = storageRef.child('files/' + file.name);
        var uploadTask = fileRef.put(file);

        uploadTask.on('state_changed',
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                displayNotification('File Uplading : ',progress," %")
                console.log('Upload is ' + progress + '% done');
            },
            function(error) {
                console.error('Error uploading file:', error);
                reject(error);
            },
            function() {
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

function displayFiles() {
    var fileList = document.getElementById("file-list");
    var userId = firebase.auth().currentUser.uid;

    fileList.innerHTML = "";

    firebase.firestore().collection("files").where("userId", "==", userId)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var fileData = doc.data();
                var listItem = document.createElement("li");

                var fileType = getFileType(fileData.fileName);

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
                    fileElement.style.height = "400px";
                } else {
                    fileElement = document.createElement("a");
                    fileElement.href = fileData.downloadURL;
                    fileElement.textContent = fileData.fileName;
                }

                listItem.appendChild(fileElement);

                fileList.appendChild(listItem);
            });
        })
        .catch(function(error) {
            console.error("Error getting user files:", error);
        });
}

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

