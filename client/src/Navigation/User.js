import React, { useEffect, useState } from 'react';
import PlaylistCreation from '../components/PlaylistCreation';

// components
import SearchTrack from '../components/SearchTrack';
import UserPlaylists from '../components/UserPlaylists'

const User = ({authUser}) => {

    const [user, setUser] = useState('jacob@test.ca');

    // Track search variables
    const [track, setTrack] = useState('');
    const [searchMethod, setSearchMethod] = useState('track');

    // Creation variables
    const [createName, setCreateName] = useState('');
    const [createDesc, setCreateDesc] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    // Create Button Values
    const [createBtnName, setCreateBtnName] = useState('');
    const [createBtnDesc, setCreateBtnDesc] = useState('');
    const [createBtnPrivate, setCreateBtnPrivate] = useState('');
    // Edit Variable
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editIsPrivate, setEditIsPrivate] = useState('');
    // Edit Btn
    const [editBtnName, setEditBtnName] = useState('');
    const [editBtnDesc, setEditBtnDesc] = useState('');
    const [editBtnIsPrivate, setEditBtnIsPrivate] = useState(false)


    // necessary to prevent infinite loop
    const isPrivateChanged = () => {
        setIsPrivate(!isPrivate);
    }

    const editIsPrivateChanged = () => {
        setEditIsPrivate(!editIsPrivate);
    }

    const submitCreate = function () {
        setCreateBtnName(createName);
        setCreateBtnDesc(createDesc);
        setCreateBtnPrivate(isPrivate);
    }

    const submitEdit = function () {
        setCreateBtnName(editName);
        setCreateBtnDesc(editDesc);
        setCreateBtnPrivate(editIsPrivate);
    }
    
    useEffect(() => {
        
    }, [createBtnName, editBtnName])

    return (
        <div className="User">
            <h1>Authenticated User</h1>

            <div>

                <h3>My Playlists</h3>

                <div>

                    <UserPlaylists user = {user}/>

                </div>

            </div>

            <div>

                <h3>Create a Playlist</h3>

                <div>
                        Name: <input placeholder='Name' value={createName} onChange={(e) => setCreateName(e.target.value)}/>
                </div>
                <div>
                        Description: <input placeholder='Description' value={createDesc} onChange={(e) => setCreateDesc(e.target.value)}/>
                </div>
                <div>
                        Private: <input type="checkbox" checked={isPrivate} onChange={isPrivateChanged}/>
                </div>
                <div>
                    <button onClick={submitCreate}>Create</button>
                </div>
                <div>
                    <PlaylistCreation listName={createBtnName} listDescription = {createBtnDesc} listPrivate = {createBtnPrivate} listCreator={user}/>
                </div>

            </div>

            <div className="openTrackSearch">

                <h3>Search Tracks</h3>
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

                <h3>Edit a Playlist</h3>
                <p>Input the name of the playlist you would like to edit and the new information</p>
                <div>
                    Name: <input type='text' placeholder='name' value={editName} onChange={(e) => setEditName(e.target.value)}/>
                </div>
                <div>
                    Description: <input type='text' placeholder='name' value={editDesc} onChange={(e) => setEditDesc(e.target.value)}/>
                </div>
                <div>
                        Private: <input type="checkbox" checked={editIsPrivate} onChange={editIsPrivateChanged}/>
                </div>
                <div>
                    <button onClick={submitEdit}>Submit</button>
                </div>
                <div>
                    <PlaylistCreation listName={editBtnName} listDescription = {editBtnDesc} listPrivate = {editBtnIsPrivate} listCreator={user}/>
                </div>

            </div>

        </div>
    );

}

export default User;