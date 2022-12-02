import React, { useEffect, useState } from 'react';
import HomePage from "./components/HomePage";

function App() {

  const getUserPlaylist = async (searchTerm) => { //get playlists of a specific user
    fetch(`/api/secure/userlists/` + searchTerm)
      .then(res => res.json())
      .then(data => {
        //setPlaylists(data);
      })
  }

  return (
    <div className="App">
      
      <HomePage />

    </div>
  );
}

export default App;
