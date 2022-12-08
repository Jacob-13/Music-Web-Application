import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Track from './Track';

const SearchTrack = ({searchMethod, searchValue}) => {

    const [result, setResult] = useState([]);
    const [selected, setSelected] = useState(null);

    const searchTracks = async (method, value) => {
        fetch(`/api/open/${method}/${value}`)
            .then(res => res.json())
            .then(data => {
                setResult(data);
            });
    }
    
    const toggle = (i) => {
        
        if (selected === i) {
            return setSelected(null);
        }

        setSelected(i);
    }

    useEffect(() => {
        searchTracks(searchMethod, searchValue);
    }, [searchMethod, searchValue, selected]);

    return(

        <div className="trackSearchResult">

            {
                result?.length > 0
                    ? (
                        <ol>
                            {
                                result.map((track, i) => (
                                    <div>
                                        <Track id={track.track_id} index={i} toggle={toggle} selection={selected}/>
                                    </div>
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

export default SearchTrack;