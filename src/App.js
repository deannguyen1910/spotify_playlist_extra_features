import React, {useState} from 'react';


const client_id = '50adb8b40a1b44cc82202cc7b0546f1f'; // Replace with your client ID
const redirect_uri = 'http://localhost:3000/callback'; // Replace with your redirect URI
const scope = 'user-read-private user-read-email';
const client_secret = '1ffc746c42304eaa8136fbf85e98e9df'
var code

function App() {
  const [token, setToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleLogin = () => {
    // console.log("handleLogin")
    const state = generateRandomString(16);
    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }).toString()}`;
    code = authUrl;
    // console.log(code)
    getToken()
  };
  
  const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
  const getToken = () => {
    console.log("getToken")
    const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'playlist-read-private'
      })
    };
  
    fetch('https://accounts.spotify.com/api/token', authOptions)
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          setToken(data.access_token);
          console.log(data.access_token)
        }
      })
      .catch(error => console.error('Error:', error));
  };
  
  const getPlaylists = () => {
    console.log(token)
  }

  const searchSpotify = (query) => {
    const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent('Last Famouse Word')}`;

    fetch(SEARCH_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        setSearchResults(data.tracks.items); // Assuming we're searching for tracks
        
    });
  };

  const fetchUserPlaylists = () => {
    const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/shows?offset=0&limit=20';

    return fetch(PLAYLISTS_ENDPOINT, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Request failed');
    })
    .then(data => {
      console.log(data.items)
    })
    .catch(error => console.error('Error fetching user playlists:', error));
};


  return (
    <div>
      <button onClick={handleLogin}>Login with Spotify</button>
      <button onClick={getPlaylists}>Get Playlist</button>
      <button onClick={searchSpotify}>Search Songs</button>
      <button onClick={fetchUserPlaylists}>Get my Playlist</button>
    </div>
  );
}

export default App;
