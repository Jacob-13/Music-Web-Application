import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import PlaylistTrack from "./PlaylistTrack"

const UserPlaylists = ({user}) => {

    const [creator, setCreator] = useState('jacob@test.ca');
    const [playlists, setPlaylists] = useState([]);

    const getUserPlaylists = async () => {  //Fetching the public playlists from back-end
        fetch(`/api/secure/userlists/${creator}`)
            .then(res => res.json())
            .then(data => {
                setPlaylists(data);
        })
    }

    useEffect(() => {
        setCreator(user);
        getUserPlaylists();
        console.log('component' + creator)
    }, [user])

    return(
        <div className="userPlaylists">

            {
                playlists?.length > 0
                    ? (
                        <ol>
                            {
                                playlists.map((playlist) => (
                                    <PlaylistTrack playlist={playlist}/>
                                ))
                            }
                        </ol>
                    ) : (
                        <p>Tracks not found!</p>
                    )
            }

        </div>
    );

}

export default UserPlaylists;