import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PLAYLISTSITEMS_ENDPOINT = 'https://api.spotify.com/v1/playlists/';

const SpotifyGetPlaylistsItems = () => {
    const [selectedPlaylist, setSelectedPlaylist] = useState({});

    const fetchAllPlaylistItems = async (url, allItems = []) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
            });
            const data = response.data;
            allItems.push(...data.items);

            if (data.next) {
                return fetchAllPlaylistItems(data.next, allItems);
            } else {
                return allItems;
            }
        } catch (error) {
            console.log(error);
            return allItems;
        }
    };

    const getPlaylistsItems = () => {
        if (selectedPlaylist.value) {
            const initialUrl = PLAYLISTSITEMS_ENDPOINT + selectedPlaylist.value + '/tracks';
            fetchAllPlaylistItems(initialUrl).then((allItems) => {
                // Sort the items by track name
                const sortedItemsByName = allItems.sort((a, b) => {
                    const nameA = a.track?.name || ''; // Handle undefined track
                    const nameB = b.track?.name || ''; // Handle undefined track
                    return nameA.localeCompare(nameB);
                });
                //console.log("by name, ", sortedItemsByName); // Sorted items
                localStorage.setItem("sortedPlaylistItemsByName", JSON.stringify(sortedItemsByName))

                // const sortedItemsById = allItems.sort((a, b) => {
                //     const nameA = a.track?.id; // Handle undefined track
                //     const nameB = b.track?.id; // Handle undefined track
                //     return nameA.localeCompare(nameB);
                // });
                // console.log(sortedItemsById);
                // localStorage.setItem("sortedPlaylistItemsById", sortedItemsById)
            });
        }
    };

    const handleConfirm = () => {
        const storedPlaylists = localStorage.getItem('selectedPlaylists');
        if (storedPlaylists) {
            setSelectedPlaylist(JSON.parse(storedPlaylists));
        }
    };

    useEffect(() => {
        if (Object.keys(selectedPlaylist).length > 0) {
            getPlaylistsItems();
        }
    }, [selectedPlaylist]);

    return (
        <div className='container'>
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
};

export default SpotifyGetPlaylistsItems;
