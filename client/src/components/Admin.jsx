import React, { useState } from "react";
import { useEffect } from "react";

const PromoteAdmin = ({adminEmail}) => {

    const [name, setName] = useState('default react');
    const [description, setDescription] = useState('This is the default description. Edit to replace me!');
    const [isPrivate, setIsPrivate] = useState(true);
    const [creator, setCreator] = useState('jacob@test.ca');
    const [admin, setAdmin] = useState("");

    const options = {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        }
    }

    const createPlaylist = async () => {  //Fetching the public playlists from back-end
        fetch(`/api/grantAdmin/${admin}`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data);
        })
    }

    useEffect(() => {
        setAdmin(adminEmail);
        createPlaylist();
    }, [adminEmail]);

    return (

        <div className="PlaylistCreation">
            <p>New Admin!</p>
        </div>

    )

}

export default PromoteAdmin;