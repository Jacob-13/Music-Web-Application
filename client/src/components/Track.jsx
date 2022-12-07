import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Track = ({id}) => {
    
    const [track, setTrack] = useState({});

    const getTrackInfo = async (track_id) => {
        fetch("/api/track/" + track_id)
            .then(res => res.json())
            .then(track => {
                setTrack(track);
            });
    }
    
    const playTrack = function() {
        window.open(`https://www.youtube.com/results?search_query=${track.track_title}+By+${track.artist_name}`, '_blank');
    }

    useEffect(() => {
        getTrackInfo(id);
    }, [id]);

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
                    <p> Duration: {track.track_duration} <button onClick={playTrack}>Play</button> </p>
                ) : (
                    <p>There are no tracks in this playlist</p>
                )
            }

       </div>
        

    );

}

export default Track;