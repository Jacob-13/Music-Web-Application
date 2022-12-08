import React, { useEffect, useState } from 'react';
import PublicPlaylists from '../components/PublicPlaylists';
import '../SecurityAndPrivatePolicy.txt';
import { getAuth, updateProfile } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';

// Component Dependencies
import SearchTrack from '../components/SearchTrack'
import PromoteAdmin from '../components/Admin';

const Admin = () => {

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

    const auth = getAuth(firebaseApp);
    
    // Track Searching Variables
    const [track, setTrack] = useState(''); // Used to hold the track search-bar value
    const [searchMethod, setSearchMethod] = useState('track');
    const [btnTrack, setBtnTrack] = useState("");

    useEffect(() => {
        console.log(track);
    }, [track])


    const [newAdmin, setNewAdmin] = useState("");
    /////////////////////
    //Function to see if I can get user data

    const adminTest = document.querySelector('#adminTest')

    const getAdminDeets = async () => {
        fetch("/api/admin")
            .then(res => {console.log(res.body)});
    }

    const submitCreate = function () {
        setBtnTrack(track);
    }
   
    const [disUser, setDisUser] = useState("");

    const disableUser = function () {
        var user = disUser;
        updateProfile(user, {disabled: true});
    }
    
    return (
        <div className="Home">

            <h1>PJ Music App</h1>

            <div newAdmin>
                <input id="newAdmin" value={track} onChange={(e) => setTrack(e.target.value)}></input>
                <button id="btnLogin" type="button" class="button buttonBlue" onClick={submitCreate}>Add Admin</button>
                <PromoteAdmin adminEmail={btnTrack}/>
            </div>
            <input id="disableUser" onChange={(e) => setDisUser(e.target.value)}></input>
            <button id="btnLogin" type="button" class="button buttonBlue" onClick={disableUser}>Disable User</button>
            <div>

            </div>

            <div>

                <p>
                    Welcome! This app *hypothetically* offers users the features to create new playlists and access
                    their favourite songs via a search feature. Feel free to browse other users public playlists by
                    searching by playlists!
                </p>

            </div>

            
            <div>

                <h1>Public Playlists</h1>
                <PublicPlaylists />

            </div>

        </div>
    );

}

export default Admin;