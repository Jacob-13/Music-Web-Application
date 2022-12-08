import React, { useEffect, useState } from 'react';
import PublicPlaylists from '../components/PublicPlaylists';
import '../SecurityAndPrivatePolicy.txt';

// Component Dependencies
import SearchTrack from '../components/SearchTrack'
import PromoteAdmin from '../components/Admin';

const Admin = () => {
    
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

    return (
        <div className="Home">

            <h1>PJ Music App</h1>

            <div newAdmin>
                <input id="newAdmin" value={track} onChange={(e) => setTrack(e.target.value)}></input>
                <button id="btnLogin" type="button" class="button buttonBlue" onClick={submitCreate}>Add Admin</button>
                <PromoteAdmin adminEmail={btnTrack}/>
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