import React, { useEffect, useState } from 'react';
import PublicPlaylists from '../components/PublicPlaylists';
import '../SecurityAndPrivatePolicy.txt';

// Component Dependencies
import SearchTrack from '../components/SearchTrack'

const Home = () => {
    
    // Track Searching Variables
    const [track, setTrack] = useState(''); // Used to hold the track search-bar value
    const [searchMethod, setSearchMethod] = useState('track');

    useEffect(() => {
        console.log(track);
    }, [track])

    //onChange={(e) => setTrack(e.target.value)}

    //onChange={newTracks}

    /////////////////////
    //Function to see if I can get user data

    const adminTest = document.querySelector('#adminTest')

    const getAdminDeets = async () => {
        fetch("/api/admin")
            .then(res => {console.log(res.body)});
    }

    /////////////////////

    return (
        <div className="Home">

            <h1>PJ Music App</h1>

            <div>
            </div>

            <div>

                <p>
                    Welcome! This app *hypothetically* offers users the features to create new playlists and access
                    their favourite songs via a search feature. Feel free to browse other users public playlists by
                    searching by playlists!
                </p>

            </div>

            <div className="openTrackSearch">

                <h1>Search Tracks</h1>
                <p>Search by Track, Genre, or Artist!</p>
                <input type='text' placeholder='Search' value={track} onChange={(e) => setTrack(e.target.value)}/>
                <select onChange={(e) => setSearchMethod(e.target.value)}>
                    <option value="track">Track</option>
                    <option value="genre">Genre</option>
                    <option value="artist">Artist</option>
                </select>

                <div>

                    <SearchTrack searchMethod = {searchMethod} searchValue = {track}/>

                </div>

            </div>

            <div>

                <h1>Public Playlists</h1>
                <PublicPlaylists />

            </div>

        </div>
    );

}

export default Home;