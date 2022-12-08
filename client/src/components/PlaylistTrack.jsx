import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Track from './Track';

const PlaylistTrack = ({playlist}) => {

    const [selected, setSelected] = useState(null);

    const toggle = (i) => {
        
        if (selected === i) {
            return setSelected(null);
        }

        setSelected(i);
    }

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
                    playlist.track_ids.map((id, i) => (
                        <Track id={id} index={i} toggle={toggle} selection={selected}/>
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