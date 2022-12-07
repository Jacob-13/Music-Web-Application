import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Track from './Track';

const PlaylistTrack = ({playlist}) => {

    return (
       <li>
        {
            playlist ? (
                <div className="playlist">
                    {playlist.name}
                </div>
            ) : (
                <div>No Playlists Found!</div>
            )
        }

        {
            playlist.track_ids?.length > 0
                ? (
                    playlist.track_ids.map((id) => (
                        <Track id={id}/>
                    ))
                ) : (
                    <div>
                        This playlist has no tracks.
                    </div>
                )
        }

       </li>
    );

}

export default PlaylistTrack;