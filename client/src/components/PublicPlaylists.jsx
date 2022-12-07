import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import PlaylistTrack from "./PlaylistTrack";

const PublicPlaylists = () => {

    const [playlists, setPlaylists] = useState([]);
    
    const getPublicPlaylists = async () => {  //Fetching the public playlists from back-end
        fetch("/api/open/lists")
            .then(res => res.json())
            .then(data => {
                setPlaylists(data);
        })
    }

    useEffect(() => {
        getPublicPlaylists();
    }, [])

    return (
        <div className="publicPlaylists">

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
                    <p>No Playlists Found</p>
                )
            }

        </div>
    );

}

export default PublicPlaylists;