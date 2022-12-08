import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Track = ({id, index, toggle, selection}) => {
    
    const [track, setTrack] = useState({});
    const [selected, setSelected] = useState(null);

    const getTrackInfo = async (track_id) => {
        fetch("/api/track/" + track_id)
            .then(res => res.json())
            .then(track => {
                setTrack(track);
            });
    }
    
    /*
    const toggle = (i) => {
        if (selected === i) {
            return setSelected(null);
            console.log(selected)
        }
    
        setSelected(i);
        console.log(selected)
    }*/

    const playTrack = function() {
        window.open(`https://www.youtube.com/results?search_query=${track.track_title}+By+${track.artist_name}`, '_blank');
    }

    useEffect(() => {
        getTrackInfo(id);
        setSelected(selection);
    }, [id]);

    //onClick={() => toggle(index)}

    return (
       <div className="trackInformation" >
            {
                track ? (
                    <div className="trackBasicInfo" onClick={() => toggle(index)}>
                        <b>{track.track_title}</b> Artist: {track.artist_name}
                    </div>
                ) : (
                    <p>There are no tracks in this playlist</p>
                )
            }

            {
                track ? (
                    <div className={
                        selection === index ? 'trackDetail show' : 'trackDetail'
                    }>
                        <p> Duration: {track.track_duration} <button onClick={playTrack}>Play</button> </p>
                    </div>
                ) : (
                    <p>There are no tracks in this playlist</p>
                )
            }

       </div>
        

    );

}

export default Track;