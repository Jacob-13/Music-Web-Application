import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import TrackBasic from './TrackBasic';

const PlaylistTrack = ({playlist}) => {
    
    const [list, setList] = useState({});

    /*const getTrackInfo = async (routeEnd) => {
        fetch("/api/track/" + routeEnd)
            .then(res => res.json())
            .then(track_id => {
                setTrack(track_id);
            });
    }

    {track.track_title} By {track.artist_name}
    */
    useEffect(() => {
        setList(playlist);
    }, []);

    return (
       <li>
        {
            list ? (
                <div className="playlist">
                    {list.name}
                </div>
            ) : (
                <div>No Playlists Found!</div>
            )
        }

        {
            list.track_ids?.length > 0
                ? (
                    list.track_ids.map((id) => (
                        <TrackBasic id={id}/>
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