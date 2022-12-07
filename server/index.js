import { createRequire } from "module";
//import { getOverlayDirection } from "react-bootstrap/esm/helpers";
//import { getHeapCodeStatistics } from "v8";
const require = createRequire(import.meta.url);

const Firestore = require('@google-cloud/firestore');
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const db = new Firestore({
    projectId: "se3316-pparlato-jjohn483-lab4",
});
const app = express();

const router = express.Router();

// Setup serving front-end code
app.use('/', express.static('static'));
app.use(express.json());
// Parse data in body as JSON
router.use(express.json());


const port = 5000;
//const Conf = require('conf');
//const config = new Conf();

//const { PassThrough } = require('stream');
//const { type } = require('os');
//const e = require('express');

/*  
    Firestore stores data in Documents, which are stored in Collections. Firestore creates collections and 
    documents implicitly the first time you add data to the document. You don't need to explicitly create
    collections or documents
*/

const docRef = db.collection('Playlists').doc('name');

docRef.set({

    average_rating: 5,
    creator: 'Jacob',
    duration: '4:35',
    last_modified_date: '29/11/2022',
    name: 'first test',
    number_of_tracks: 2,
    track_ids: [2,3]

});

async function asynchCall() {
    try {
        const document = db.collection('Playlists').doc('new doc');
        await document.delete();
    } catch (error) {
        console.log(error);
    }
};

asynchCall();
//success
/*
async function asyncCall() {
    console.log('calling');
    const snapshot = await db.collection('Playlists').get();
    
    // console.log(snapshot);
    
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
}

asyncCall();
*/

// Selects properties for mapping
function selectProperties(...properties) {
    return function(obj) {
        let newObj = {};
        properties.forEach(prop => {
            newObj[prop] = obj[prop];
        });
        return newObj;
    }
}

// --------   Parsing   --------//

let genreData = [];
// Parse genre data
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv())
    .on('data', (data) => {
        genreData.push(data);
    }).on('end', () => {
        console.log('genreData success');
    });

let artistData = [];
// Parse artist data
fs.createReadStream('lab3-data/raw_artists.csv')
    .pipe(csv())
    .on('data', (data) => {
        artistData.push(data);
    }).on('end', () => {
        console.log('artistData success');
    });


let trackData = [];
// Parse track data
fs.createReadStream('lab3-data/raw_tracks.csv')
    .pipe(csv())
    .on('data', (data) => {
        trackData.push(data);
    })
    .on('end', () => {
        console.log('trackData success');
        map();
    })

// Filter the data properties
function map() {

    genreData = genreData.map(selectProperties('genre_id', 'parent', 'title'));
    console.log('genreData mapped');

    artistData = artistData.map(selectProperties('artist_id', 'artist_name', 'artist_members', 'artist_active_year_begin', 'artist_active_year_end', 'artist_contact', 'artist_donation_url', 'artist_favorites'));
    console.log('artistData mapped');

    trackData = trackData.map(selectProperties('track_id', 'album_id', 'album_title', 'artist_id', 'artist_name', 'tags', 'track_date_created', 'track_date_recorded', 'track_duration', 'track_genres', 'track_number', 'track_title'));
    console.log('trackData mapped');
}



// Setup middleware to do logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});



////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3.b  Interface for searching tracks based on any combination of artist, band, genre, or track title.
//      Search results must show track title and artist name

/* 3.c  Same as former 'backend functionality 3'. Front-end can select which properties to display
        Just make the search options clickable
*/

app.get('/api/open/:trackSearch/:searchValue', (req, res) => {

    // trackSearch will be the option selected from the drop down menu (artist, band, genre, or track title)
    let search = req.params.trackSearch.toLowerCase();

    // searchValue is the value typed into the search bars
    let value = req.params.searchValue.toLowerCase();

    let tracks = [];

    switch(search) {
        case 'artist':
            {
                let artistIds = [];

                // Filter the artistData array based on inlcuding search result
                const artists = artistData.filter(artist => artist.artist_name.toLowerCase().includes(value));

                // Map artists array to only include artist_id prop
                const artistProperties = artists.map(selectProperties('artist_id'));

                artistProperties.forEach(artist => {
                    artistIds.push(artist.artist_id);
                });

                // Getting the tracks for given artists
                artistIds.forEach(artistId => {             // For each artist ID
                    trackData.forEach(track => {            // For each track
                        if(track.artist_id == artistId){    // If the track artist_id matches given artist id, add track
                            tracks.push(track);
                        }
                    })
                });

                if(tracks.length > 3){
                    tracks.length = 3;
                    res.send(tracks);       // respond with an array of tracks with matching artist
                } else if (tracks.length > 0){
                    res.send(tracks);
                }
                else {
                    res.status(404).send(`Artist ${value} was not found!`);
                }
            }
            break;
        case 'band': // Im not sure what the band means
            break;
        case 'genre': // Potentially works for now, but should maybe change for more accuracy
            {
                // Check if the genre title matches the search value

                tracks = trackData.filter(track => track.track_genres.toLowerCase().includes(value));

                tracks.length = 3;
                res.send(tracks);
            }
            break;
        default: // Track search
            {
                tracks = trackData.filter(track => track.track_title.toLowerCase().includes(value));

                if(tracks.length > 3){
                    tracks.length = 3;
                    res.send(tracks);
                } else if(tracks.length > 0) {
                    
                    res.send(tracks);
                }
                else {
                    res.status(404).send(`Track ${value} was not found!`);
                }
            }
    };

});


/* 3.f

    * List of public play-lists ordered by last modified date and showing:
    * name, creator, total play-time, number of tracks, average rating
    
    * Playlist should consist of following properties:
    * name
    * creator
    * duration
    * number of tracks
    * list of track ids
    * average rating
    * last modified date
    * Description (optional)
    * public/private (default set to private)

*/
app.get('/api/open/lists', (req, res) => { // remember to order by last modified date

    (async () => {

        let playlists = [];

        try {
            const snapshot = await db.collection('Playlists').get();

            snapshot.forEach((doc) => {
                playlists.push(doc.data());
            });

            return res.status(200).send(playlists);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

/* 
    * 4.a
    * creator should be set to the signed in user
*/
app.get('/api/secure/userlists/:user', (req,res) => {
    let creator = req.params.user.toLowerCase();

    (async () => {

        let playlists = [];

        try {

            const snapshot = await db.collection('Playlists').get();

            snapshot.forEach((doc) => {
                if(doc.data().creator.toLowerCase() == creator){ // if user == playlist creator, add playlist
                    playlists.push(doc.data());
                }
            });

            if(playlists.length > 20){                  // Limit of 20 lists
                playlists.length = 20;
                return res.status(200).send(playlists);
            } else if(playlists.length == 0) {
                return res.status(404).send(`No playlists found!`);
            } 
            else {
                return res.status(200).send(playlists);
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});


/* 
    * 4.b
    * creator should be set to the signed in user
*/
app.get('/api/secure/list/:list', (req,res) => { //Broken function
    let listName = req.params.list;

    (async () => {

        //let listTracks;

        try {

            const listDoc = await db.collection('Playlists').get(listName);

            if(listDoc.data()){
                res.status(200).send(listDoc.data());
            } else {
                res.status(404).send(`Playlist ${listName} not found!`); 
            }
            return listDoc.data();

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});
////////////////////////////////////////////////////////////////////////////////////////////////////////


// Backend functionality 1
app.get('/api/genres', (req, res) => {
    res.send(genreData);
});

// Backend functionality 2
app.get('/api/artist/:id', (req, res) => {
    
    let artistId = req.params.id;

    const artist = artistData.find(art => art.artist_id === artistId);
    
    if(artist){
        console.log(artist);
        res.send(artist);
    }
    else {
        res.status(404).send(`Artist id ${artistId} not found!`);
    }
});

// Backend functionality 3
app.get('/api/track/:id', (req, res) => {
    let trackId = req.params.id;
    let tempArr = trackId.split('%'); // when being sent spaces are changed to '%'. This changes back to spaces for proper searching
    trackId = tempArr.join(' ');

    const trackResult = trackData.find(track => track.track_id == trackId);
    
    if(trackResult){
        res.send(trackResult);
    } else {
        res.status(404).send(`Track ID ${trackId} not found!`)
    }
});

// Backend functionality 4
app.get('/api/tracks/:match', (req, res) => {
    
    let trackIds = [];

    const searchValue = req.params.match.toLowerCase();
    
    // looks for matches in both the track title and the ablum title with the corresponding search value
    const tracks = trackData.filter(t => t.track_title.toLowerCase().includes(searchValue) || t.album_title.toLowerCase().includes(searchValue));
    const trackIdProperties = tracks.map(selectProperties('track_id'));

    trackIdProperties.forEach(track => {
        trackIds.push(parseInt(track.track_id));
    })
    
    // limits tracks being sent to the front end to 10
    if(trackIds.length > 10){
        trackIds.length = 10;
        res.send(trackIds);
    }
    else if(trackIds.length < 1) {
        res.status(404).send('No tracks found!');
    }
    else{ // sends all track results if there is less than 10
        res.send(trackIds);
    }
});

// Backend functionality 5: matching artists name to the search, responding with list of artist ids
app.get('/api/artists/:match', (req, res) => {

    const artistSearch = req.params.match.toLowerCase();

    let artistIds = [];

    const artists = artistData.filter(artist => artist.artist_name.toLowerCase().includes(artistSearch));
    const artistProperties = artists.map(selectProperties('artist_id'));

    artistProperties.forEach(artist => {
        artistIds.push(artist.artist_id);
    });

        if(artistIds.length > 0) {
            res.send(artistIds);
        }
        else {
            res.status(404).send(`No artist matches were found!`);
        }
});

// Backend functionality 6

app.put('/api/lists/:name', (req, res) => {

    const listName = req.params.name;
    
    let tracks = req.body.track;
    console.log(tracks);


    if(config.has(listName)) {
        res.status(400).send(`${listName} already exists!`);
    }
    else {
        config.set(listName, tracks);
        res.send(config.get(listName));
    }
});

// Backend functionality 7: Updating tracks for a given list name
app.post('/api/lists/:name', (req, res) => {

    const listName = req.params.name;
    
    let tracks = req.body.track; 
    console.log(tracks);

    if(config.has(listName)){
        config.set(listName, tracks); 
        res.send(config.get(listName));
    }
    else { // if the playlist the user is updating doesnt exist, send 404 error.
        res.status(404).send(`Playlist ${listName} not found!`);
    }
});

// Backend functionality 8: Getting the track ids for a given list name
app.get('/api/lists/:name', (req, res) => {

    const listName = req.params.name;

    if(config.has(listName)){
        res.send(config.get(listName));
    }
    else {
        res.status(404).send(`Playlist ${listName} not found!`);
    }
});

// Backend functionality 9: Deleting a list
app.delete('/api/lists/:name', (req, res) => {
    
    const listName = req.params.name;

    if(config.has(listName)){
        config.delete(listName);
        res.send(`${listName} was deleted!`);
    }
    else {
        res.status(404).send(`Playlist ${listName} not found!`)
    }
});


// Backend functionality 10: 
app.get('/api/lists', (req, res) => {

    let allLists = [];

    // Retrieves the data from the config db
    var listData = fs.readFileSync(config.path, 'utf8'); //objects with key as name and tracks as value
    let list = JSON.parse(listData);

    // Obtains the names of all the lists
    let listNames = [];
    for(var key in list){
        listNames.push(key);
    };

    // The following nested operation creates an array of objects with properties for list name, num of tracks, and duration
    if(listNames.length != 0)
    {
        // For each playlist
        for(i = 0; i < listNames.length; i++)
        {
            let trackList = config.get(listNames[i]); // Retrieves the track list from a playlist
            let duration = 0;

            if(trackList.length != 0)
            {
                // For each track in a playlist
                for(j = 0; j < trackList.length; j++)
                {
                    for(k = 0; k < trackData.length; k++)
                    {
                        if(trackData[k].track_id == trackList[j])
                        {
                            trackDuration = trackData[k].track_duration;
                            duration += trackDuration;
                        };
                    };
                };
            };
            // New play list object is added to the array of all lists
            let newPlaylist = {
                name: listNames[i],
                num_of_tracks: trackList.length,
                length: duration
            };
            allLists.push(newPlaylist);
        };
        res.send(allLists);
    }
    else {
        res.status(400).send('No lists exist yet!');
    }
});

// Install the router at /api/lists
app.use('/api/test', router)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

/////////////////////////////////////////////////////////////////////////////////

//Section 5 - Admin Authentication
//Import needed collections from firebase firestore
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

//GET function for getting all users with Admin status
app.get('/api/admin', (req, res) => {
    //Create an async function to use await
    async () => {
        //Await the getDocs function to get all Admin users and assign them to a variable
        const querySnapshot = await getDocs(collection(db, "Admin"));
        //Read that variable
        querySnapshot.forEach((doc) => {
            //Log the info
            console.log(`${doc.id} => ${doc.data()}`);
        });
    }
});

//POST function for adding users to the admin database
app.post('/api/grantAdmin/:userEmail', (req, res) => {
    //Get the user input to know the email to be added to the admin list
    const newAdminEmail = req.params.name;
    //Async function so await can be used
    async () => {
        //Await setDoc to finish
        await setDoc(doc(db, "admin"), {
            //Add the new Admin to the admin database
            email: newAdminEmail
        });
    }
});
