import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PlaylistCreation = ({listName, listDescription, listPrivate, listCreator}) => {

    const [name, setName] = useState('default react');
    const [description, setDescription] = useState('This is the default description. Edit to replace me!');
    const [isPrivate, setIsPrivate] = useState(true);
    const [creator, setCreator] = useState('jacob@test.ca');

    const list = {
        'average_rating': '4.5',
        'name': name,
        'track_ids': [2,3],
        'status': isPrivate,
        'description': description
    }

    const options = {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(list)
    }

    const createPlaylist = async () => {  //Fetching the public playlists from back-end
        fetch(`/api/secure/create/${creator}`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data);
        })
    }

    useEffect(() => {

        setName(listName);
        setDescription(listDescription);
        setIsPrivate(listPrivate);
        setCreator(listCreator);

        createPlaylist();
    }, [listName, listDescription, listPrivate, listCreator])

    return (

        <div className="PlaylistCreation">
            <p>Playlist Created!</p>
        </div>

    )

}

export default PlaylistCreation;