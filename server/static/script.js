document.getElementById('track-search').addEventListener('click', searchTracks);
document.getElementById('artist-search').addEventListener('click', searchArtists);
document.getElementById('album-search').addEventListener('click', searchTracks);
document.getElementById('new-track-search').addEventListener('click', newTracks);
document.getElementById('submitBtn').addEventListener('click', addSelectedTracks);
document.getElementById('createBtn').addEventListener('click', createPlaylist);
document.getElementById('modify-search').addEventListener('click', modifySearchResult);
document.getElementById('modify-submit').addEventListener('click', changeTracks);
document.getElementById('modifyBtn').addEventListener('click', replaceTracks)
const resultsList = document.getElementById('resultsList');
const playlists = document.getElementById('playlists');
const tracklist = document.getElementById('tracks');
let tempNewTracks = [];
let modifyTracks = [];

// Used by other functions to clear a list before dynamically populating it again
function listClear(list) {
    while(list.firstChild){
        list.firstChild.remove();
    }
}

// Called at the end of the script and at the end of some functions. Loads all previously created playlists into the list
function loadPlaylists(){

    listClear(playlists);

    // This request gets a list of all the available playlists (an array with objects {name: '', tracks: [], duration: ''})
    fetch('/api/lists')
    .then(res => res.json()
    .then(lists => {
        lists.forEach(lists => {
            // Create new list item for the playlist information
            const newItem = document.createElement('li');
            newItem.className = 'playlist-item';
            newItem.id = lists.name;
            newItem.addEventListener('click', displayPlaylist);
            newItem.appendChild(document.createTextNode(`${lists.name}: Total tracks ${lists.num_of_tracks} : duration ${lists.length}`));
            playlists.appendChild(newItem);

            // Create Delete button
            const newDelBtn = document.createElement('button');
            newDelBtn.id = lists.name + 1;
            newDelBtn.className = 'delete';
            newDelBtn.addEventListener('click', deletePlaylist);
            newDelBtn.appendChild(document.createTextNode('Delete'));
            playlists.appendChild(newDelBtn);
        });
    }));
}

// Populates the list where user selects tracks to add based on a search
function newTracks() {
    
    // Gets search value entered and fetches the routes for 
    const searchValue = document.getElementById('new-list-tracks').value;

    const route = '/api/tracks/' + searchValue;

    fetch(route)
    .then(res => res.json()
    .then(tracks => { // backend responds with the track ids of those that match the search (up to 10)
        tracks.forEach(trackId => {
            
            const idRoute = '/api/track/' + trackId;

            fetch(idRoute)
            .then(res => res.json()
            .then(selectedTrack => { // backend responds with the specific track related to the given track_id

                // create new list item and add a text node containing the track name
                const newItem = document.createElement('li');
                newItem.appendChild(document.createTextNode(selectedTrack.track_title));

                // add check box to each list item
                const checkBoxes = document.createElement('input');
                checkBoxes.type = 'checkbox';

                // id of check box = id of track
                checkBoxes.id = trackId;

                newItem.appendChild(checkBoxes);

                const orderedList = document.getElementById('new-results');
                orderedList.appendChild(newItem);
            }));

        });
    }));
}

// finds the selected tracks and adds them to a temp array, as well as the list containing added tracks
function addSelectedTracks(){

    const listOfTracks = document.getElementById('new-results');

    // iterates the list of tracks, finding the ones that are selected and pushing them to the tempNewTracks array
    for(i = 1; i < listOfTracks.childNodes.length; i++){
        let item = listOfTracks.childNodes[i];
        let itemId = item.lastChild.id;
        let id = parseInt(itemId);

        if(item.lastChild.checked){
            tempNewTracks.push(id);
        }
        
    }

    const createList = document.getElementById('new-tracks-list');

    // Takes the selected track ids and finds the track title. Adds the title to the creating list
    for(j = 0; j < tempNewTracks.length; j++){

        const trackId = tempNewTracks[j];
        const route = '/api/track/' + trackId;
        
        fetch(route)
        .then(res => res.json()
        .then( track => {

            const newItem = document.createElement('li');
            newItem.appendChild(document.createTextNode(track.track_title));
            
            createList.appendChild(newItem);
        }))
    }

    listClear(listOfTracks);

}

// Takes the track ids from the array and sends them in the body of a put request
function createPlaylist(){

    // converts integers to strings
    for(i = 0; i < tempNewTracks; i++){
        tempNewTracks[i] = tempNewTracks[i] + '';
    }

    const listName = document.getElementById('playlist-name').value;
    const route = '/api/lists/' + listName;

    const update = {
        'track': tempNewTracks
    };

    const options = {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(update)
    }

    // Sends playlist name as a parameter
    fetch(route, options)
    .then(res => res.json()
    .then(data => {             // backend responds with the array of track ids for the given list name
        console.log(data);
    }));
    
    loadPlaylists();
    listClear(document.getElementById('new-tracks-list'));
    trackArrReset();
}

function trackArrReset() {
    tempNewTracks = [];
}

// Searching by track title. Called on search button press
function searchTracks() {

    // Clears Previous Search
    listClear(resultsList);

    // Accesses tracks from the backend and displays resulting tracks to the list
    const searchValue = document.getElementById('track').value.toLowerCase();

    const route = '/api/tracks/' + searchValue;

    // This fetch will send the track name or album name as a parameter and a list of 10 or less tracks
    fetch(route)
    .then(res => res.json()
    .then(data => { //The data is a list of 10 or less tracks

        data.forEach(trackId => {

            const idRoute = '/api/track/' + trackId;

            // This fetch take puts the track id as a parameter in the route, then returns the corresponding track (with all properties)
            fetch(idRoute)
            .then(res => res.json()
            .then(data => { //track with all properties
                const newItem = document.createElement('li');
                newItem.appendChild(document.createTextNode(data.track_title));

                // li element is added to the results list
                resultsList.appendChild(newItem);
            }))
        })
    }));

    document.getElementById('track').value = null;
}


// Searching by artists name. Called on Search button press
function searchArtists() {

    // Clears previous search
    listClear(resultsList);

    // Accesses tracks from the backend and displays resulting tracks to the list
    const searchValue = document.getElementById('artist').value;
    fetch('/api/artists/' + searchValue)
    .then(res => res.json()
    .then(artists => {
        artists.forEach(artistId => {
            
            fetch('/api/artist/' + artistId)
            .then(res => res.json()
            .then(artist => {

                const listItem = document.createElement('li');
                listItem.appendChild(document.createTextNode(artist.artist_name));
                resultsList.appendChild(listItem);

            }))
        })
    }));
}

// When a playlist is clicked, this function is called
function displayPlaylist(list) {

    listClear(tracklist); // Clear the list of anything that might be currently displayed
    
    let playlistName = list.srcElement.id;
    let header = document.getElementById('playlist-header');

    listClear(header); // Clear header value to be updated

    header.appendChild(document.createTextNode(playlistName)); // Display the header as the playlist name

    const route = '/api/lists/' + playlistName;
    
    fetch(route) 
    .then(res => res.json()
    .then(tracks => { // backend responds with a list of track ids for the given playlist name

        for(i = 0; i < tracks.length; i++){
            const track = tracks[i];
            console.log(tracks[i]);

            const idRoute = '/api/track/' + track;

            fetch(idRoute)
            .then(res => res.json()
            .then(data => {
                const newItem = document.createElement('li');
                newItem.className = 'playlist-item';
                newItem.appendChild(document.createTextNode(`Song: ${data.track_title}, Artist: ${data.artist_name}, Album: ${data.album_title}, Playtime: ${data.track_duration}`));
                tracklist.appendChild(newItem);

            }));

        }
    }));
};
 
// called on search btn in modify div. Used to update the search results
function modifySearchResult(){

    const searchValue = document.getElementById('modify-track-search').value;

    const route = '/api/tracks/' + searchValue;

    fetch(route)
    .then(res => res.json()
    .then(tracks => {                   // backend responds with a list of track ids that correspond to the search value
        tracks.forEach(trackId => {
            
            const idRoute = '/api/track/' + trackId;

            fetch(idRoute)
            .then(res => res.json()
            .then(selectedTrack => {
                // create new list item and add a text node containing the track name
                const newItem = document.createElement('li');
                newItem.appendChild(document.createTextNode(selectedTrack.track_title));

                // add check box to each list item
                const checkBoxes = document.createElement('input');
                checkBoxes.type = 'checkbox';
                // id of check box = id of track
                checkBoxes.id = trackId;

                newItem.appendChild(checkBoxes);

                const orderedList = document.getElementById('modify-results');
                orderedList.appendChild(newItem);
            }));
        });
    }));
}

// Used to select the tracks wanted and add them to the selected list as well as the array
function changeTracks(){
    const listOfTracks = document.getElementById('modify-results');

    // iterates through the resulting tracks from the search. pushes selected ones to an array
    for(i = 1; i < listOfTracks.childNodes.length; i++){
        let item = listOfTracks.childNodes[i];
        let itemId = item.lastChild.id;
        let id = parseInt(itemId);

        if(item.lastChild.checked){
            modifyTracks.push(id);
        }
    }

    const modifyList = document.getElementById('modified-tracks-list');

    // add the selected items (from array) to the selection list
    for(j = 0; j < modifyTracks.length; j++){

        const trackId = modifyTracks[j];
        const route = '/api/track/' + trackId;
        
        fetch(route)
        .then(res => res.json()
        .then( track => {

            const newItem = document.createElement('li');
            newItem.appendChild(document.createTextNode(track.track_title));
            
            modifyList.appendChild(newItem);
        }))
    }

    listClear(listOfTracks);
}

function replaceTracks(){

    // changes ids to strings
    for(i = 0; i < modifyTracks; i++){
        modifyTracks[i] = modifyTracks[i] + '';
    }

    const listName = document.getElementById('modify-name').value;
    const route = '/api/lists/' + listName;

    const update = {
        'track': modifyTracks
    };

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(update)
    }

    fetch(route, options)
    .then(res => res.json()
    .then(updatedList => {  // res = the updated list of tracks
        loadPlaylists();
    }));
    
    listClear(document.getElementById('modified-tracks-list'));
    modifyTrackArrReset();
}

function modifyTrackArrReset(){
    modifyTracks = [];
}

function deletePlaylist(list) {

    let playlistName = list.srcElement.id;

    // Remove the 1 from the id on the button
    let tempArr = playlistName.split('');
    tempArr.splice(tempArr.length - 1, tempArr.length);
    playlistName = tempArr.join('');

    const route = '/api/lists/' + playlistName;

    fetch(route, {method: 'DELETE'})
    .then(res => res.json()
    .then(data => {
        console.log(data);
    }));

    loadPlaylists();
};

loadPlaylists();

// ------------------------ Firebase AUTH ATTEMPT ------------------------ \\
//------------------------ VIDEO 1 IMPORTS AND BASICS ------------------------ \\
//Import the needed functions from Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword, updateProfile, setCustomUserClaims } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { btnLogin, btnLogout, btnSignup, btnUpdate, changePassword, hideLoginError, lblAuthState, showApp, showLoginError, showLoginForm, showLoginState } from '../../client/src/ui.js';

//Initialize the firebase app with the repository's values
const firebaseApp = initializeApp({
    apiKey: "AIzaSyDuh3g6xopDh9FOhrM4W0LjIjw_NOvu_ic",
    authDomain: "se3316-pparlato-jjohn483-lab4.firebaseapp.com",
    projectId: "se3316-pparlato-jjohn483-lab4",
    storageBucket: "se3316-pparlato-jjohn483-lab4.appspot.com",
    messagingSenderId: "393530132117",
    appId: "1:393530132117:web:9c1bc00dae89a62244fd9c",
    measurementId: "G-YY9YP5YCVM"
});

//Create a variable to hold onto the authorization value of the firebase app
const auth = getAuth(firebaseApp);
//connectAuthEmulator(auth, "http://localhost:9099");

//Function to allow users to login with an email and a password
const loginEmailPassword = async () => {
    //Get the email and password values from the html page
    const loginEmail = txtEmail.value;
    const loginPassword = txtPassword.value;

    //Try to log the user in with the passed values
    try{
        //Attemot to authorize the user with the passed username and password
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    }
    catch(error){
        //If it doesn.t work, log and show the user the appropreate error
        console.log(error);
        showLoginError(error);
    }
}
//Add an event listerner to call the loginEmailPassword function when the appropreate button is clicked
btnLogin.addEventListener("click", loginEmailPassword);

//Create a function to allow users to create a new account
const createAccount = async () => {
    //Get the email and password values from the html page
    const loginEmail = txtEmail.value;
    const loginPassword = txtPassword.value;
    const usersName = userName.value;

    //Try to sign the user up with the given email and password
    try{
    await createUserWithEmailAndPassword(auth, loginEmail, loginPassword)
    //Then add the name to the user's profile
    .then(function () {
        var user = auth.currentUser;
        updateProfile(user, {displayName: usersName});
        })
    .then(function (){
        window.location.reload();
    })    
    }
    catch(error){
        //If it doesn't work log the error and tell the user why
        console.log(error);
        showLoginError(error);
    }
}

//Add an event listerner to call the createAccount function when the appropreate button is clicked
btnSignup.addEventListener("click", createAccount);

const makeAdmin = () => {
    var admin = auth.currentUser;
    auth.setCustomUserClaims(admin, { admin: true }).then(() =>{
        console.log(admin);
    });
}

btnUpdate.addEventListener("click", makeAdmin);

//Funtion to monitor the login state of the user
const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
        //If the user is logged in
        if(user){
            //Display the login state and some information to the user
            console.log(user);
            showApp();
            showLoginState(user);

            hideLoginError();
        }
        //If the user isn't logged in
        else {
            //Tell the user that they aren't logged in
            showLoginForm();
            lblAuthState.innerHTML = "You're not logged in.";
        }
    });
} 

//Monitor the authorization state of the user
monitorAuthState();

//Function to detect the Auth State
onAuthStateChanged(auth, user => {
    if(user != null){
        console.log('logged in!');
    } else {
        console.log('No user');
    }
});

//Function to logout the user
const logout = async () => {
    //Sign out the user when called
    await signOut(auth);
}
//Add an event listener to call the logout function when the appropreate button is clicked
btnLogout.addEventListener("click", logout);

//Function to update the password of a logged-in user
const newPassword = async () => {
    //Assign the new password's value to a variable
    const newPasswordvalue = changePassword.value;
    //Call the update password function and pass it the new password
    updatePassword(auth.currentUser, newPasswordvalue).then(() => {
        //Log the new password to the console
        console.log("Password Updated to: " + newPasswordvalue)
    //Catch any errors
    }).catch((error) => {
        console.log(error);
    });
}
//Change the password to the text-fields value when the appropreate button is clicked
btnChangePassword.addEventListener("click", newPassword);
