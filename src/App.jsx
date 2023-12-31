import React, { useEffect, useState } from "react";
import SpotifyLogin from './components/spotifyLogin'
import SpotifyGetPlaylistsItems from './components/spotifyGetPlaylistsItems'
import CheckDuplicate from './components/checkDuplicate'
const App = () => {
  


  return (
    <div className="container">
      <SpotifyLogin/>
      <SpotifyGetPlaylistsItems />
      <CheckDuplicate />
    </div>
  );
};

export default App;