import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import PlaylistTrack from './PlaylistTrack';
import TrackBasic from './TrackBasic';

const HomePage = () => {

    const [playlists, setPlaylists] = useState([]);
    const [publicSearch, setPublicSearch] = useState('');
    const [trackSearch, setTrackSearch] = useState('');
    const [trackSearchMethod, setTrackSearchMethod] = useState('track');
    const [trackSearchResult, setTrackSearchResult] = useState([]);

    const getPublicPlaylists = async () => {  //Fetching the public playlists from back-end
        fetch("/api/open/lists")
            .then(res => res.json())
            .then(data => {
                setPlaylists(data);
        })
    }

    const searchTracks = async () => {
        fetch(`/api/open/${trackSearchMethod}/${trackSearch}`)
            .then(res => res.json())
            .then(data => {
                console.log(`/api/open/${trackSearchMethod}/${trackSearch}`)
                setTrackSearchResult(data);
                console.log("search result " + trackSearchResult)
                console.log("data " + data);
            });
    }

    useEffect(() => {
        getPublicPlaylists();
    }, []);


    return (
        <div className="homePage">

            <h1>Music App</h1>

            <div>

                <p>Welcome! This app *hypothetically* offers users the features to create new playlists and access
                    their favourite songs via a search feature. Feel free to browse other users public playlists by
                    searching by playlists!
                </p>
                <button>Login</button>

            </div>

                <h1>Search Tracks</h1>
                <input placeholder='search...' value={trackSearch} onChange={(e) => setTrackSearch(e.target.value)}/>
                <select onChange={(e) => setTrackSearchMethod(e.target.value)}>Search By ...
                    <option value="track">Track</option>
                    <option value="genre">Genre</option>
                    <option value="artist">Artist</option>
                </select>
                <button onClick={searchTracks}>Search</button>

            <div>

            <div>

                {
                    trackSearchResult?.length > 0
                        ? (
                            <ol>
                                {
                                    trackSearchResult.map((track) => (
                                        <TrackBasic id = {track.track_id}/>
                                    ))
                                }
                            </ol>
                        ) : (
                            <p>No tracks were found</p>
                        )
                }

            </div>

            </div>

            <div>

                <h1>Public Playlists</h1>
                <input placeholder='search...' value={publicSearch} onChange={(e) => setPublicSearch(e.target.value)}/>
                <button>Search</button>

            </div>

            <div>
                {
                    playlists?.length > 0
                    ? (
                        <ol className="publicPlaylists">
                        {
                            playlists.map((playlist) => (
                            <PlaylistTrack playlist={playlist}/>
                            ))
                        }

                        </ol>
                    ) : (
                        <h2>No Playlists Found</h2>
                    )
                }

            </div>
        </div>
    );
}

export default HomePage;