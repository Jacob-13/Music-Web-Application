import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const TrackDetails = ({id}) => {
    
    const [track, setTrack] = useState({});
    const [trackTitle, setTrackTitle] = useState('');
    const [trackArtist, setTrackArtist] = useState('');

    const getTrackInfo = async (track_id) => {
        fetch("/api/track/" + track_id)
            .then(res => res.json())
            .then(track => {
                setTrack(track);
                setTrackTitle(track.track_title);
                setTrackArtist(track.artist_name);
            });
    }
    
    useEffect(() => {
        getTrackInfo(id);
    }, []);

    const playTrack = function() {
        window.open(`https://www.youtube.com/results?search_query=${trackTitle}+By+${trackArtist}`, '_blank');
    }

    return (
       <div className="trackDetails" >
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

export default TrackDetails;