import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import PlaylistTrack from "./PlaylistTrack"

const UserPlaylists = ({user}) => {

    const [creator, setCreator] = useState('jacob@test.ca');
    const [playlists, setPlaylists] = useState([]);
    const [selected, setSelected] = useState(null);

    const getUserPlaylists = async () => {  //Fetching the public playlists from back-end
        fetch(`/api/secure/userlists/${creator}`)
            .then(res => res.json())
            .then(data => {
                setPlaylists(data);
        })
    }

    const toggle = (i) => {
        
        if (selected === i) {
            return setSelected(null);
        }

        setSelected(i);
    }

    useEffect(() => {
        setCreator(user);
        getUserPlaylists();
        console.log('component' + creator)
    }, [user, selected])

    return(
        <div className="userPlaylists">

            {
                playlists?.length > 0
                    ? (
                        <ol>
                            {
                                playlists.map((playlist, i) => (
                                    <PlaylistTrack playlist={playlist} index={i} toggle={toggle} selection={selected}/>
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