import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from 'react-select'

const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
const MYPLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const CLIENT_ID="50adb8b40a1b44cc82202cc7b0546f1f"
const SPOTIFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
const REDIRECT_URL_AFTER_LOGIN="http://localhost:3000"
var token_valid = 0
/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    //console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const SpotifyLogin = () => {
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState({});

  const handleGetPlaylists = () => {
    axios
      .get(MYPLAYLISTS_ENDPOINT + "?limit=50", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setPlaylists(response.data);
        //console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  useEffect(() => {
    //console.log(window.location.hash)
    if (token_valid == 0) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
      handleGetPlaylists()
      token_valid = 1
      }
  });

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  const options = playlists.items
  ? playlists.items.map(item => ({
      value: item.id,
      label: item.name
    }))
  : [];

  const handleSelectChange = selectedOption => {
    setSelectedPlaylist(selectedOption);
    localStorage.setItem("selectedPlaylists", JSON.stringify(selectedOption));
    //console.log("handleSelected", selectedOption)
  };

  return (
    <div className="container">
      <h1>hi</h1>
      <button onClick={handleLogin}>login to spotify</button>
      <Select
        options={options}
        onChange={handleSelectChange}
        value={selectedPlaylist}
      />
    </div>
  );
};

export default SpotifyLogin;