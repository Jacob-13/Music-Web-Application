/*import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Track from './Track';

const SearchTrack = ({searchMethod}, {searchValue}) => {

    const [result, setResult] = useState([]);

    const searchTracks = async (method, value) => {
        fetch(`/api/open/${method}/${value}`)
            .then(res => res.json())
            .then(data => {
                setResult(data);
            });
    }

    useEffect(() => {
        searchTracks(searchMethod, searchValue);
    }, [searchMethod, searchValue]);

    return(

        <div className="trackSearchResult">

            {
                result?.length > 0
                    ? (
                        <ol>
                            {
                                result.map((track) => (
                                    <p>{track.track_id}</p>
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

export default SearchTrack;*/
