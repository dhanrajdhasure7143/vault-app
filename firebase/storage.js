// Function to upload a file to Firebase Storage
function uploadFile(file) {
    var storageRef = firebase.storage().ref();
    var fileRef = storageRef.child(file.name);
    return fileRef.put(file);
}

// Function to add file metadata to Firestore/Realtime Database
function addFileMetadata(userId, fileName, downloadURL) {
    var db = firebase.firestore();
    return db.collection("files").add({
        userId: userId,
        fileName: fileName,
        downloadURL: downloadURL
    });
}

// Function to retrieve user's files from Firestore/Realtime Database
function getUserFiles(userId) {
    var db = firebase.firestore();
    return db.collection("files").where("userId", "==", userId).get();
}

// Function to get user's files from Firebase Storage
function getUserFiles() {
    var user = firebase.auth().currentUser;
    var filesRef = firebase.storage().ref().child('users/' + user.uid);
    
    return filesRef.listAll()
        .then(function(res) {
            var files = [];
            res.items.forEach(function(itemRef) {
                files.push(itemRef.name);
            });
            return files;
        })
        .catch(function(error) {
            console.error('Error getting user files:', error);
            return [];
        });
}

