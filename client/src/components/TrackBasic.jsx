import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import TrackDetails from './TrackDetails';

const TrackBasic = ({id}) => {
    
    const [track, setTrack] = useState({});

    const getTrackInfo = async (track_id) => {
        fetch("/api/track/" + track_id)
            .then(res => res.json())
            .then(track => {
                setTrack(track);
            });
    }
    
    useEffect(() => {
        getTrackInfo(id);
    }, []);

    return (
       <div className="trackBasic" >
            {
                track ? (
                    <p><b>{track.track_title}</b> Artist: {track.artist_name}</p>
                ) : (
                    <p>There are no tracks in this playlist</p>
                )
            }

            {
                track ? (
                    <TrackDetails id={id} />
                ) : (
                    <p>nope</p>
                )
            }

       </div>
        

    );

}

export default TrackBasic;