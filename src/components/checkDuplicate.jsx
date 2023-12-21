import React, { useEffect, useState } from 'react';

const CheckDuplicate = () => {
    const [playlistItems, setPlaylistItems] = useState([]);

    const handleCheckDuplicate = () => {
        const storedPlaylistsItem = localStorage.getItem("sortedPlaylistItemsByName");
        if (storedPlaylistsItem) {
            const parsedItems = JSON.parse(storedPlaylistsItem);
            setPlaylistItems(parsedItems); // Setting the state with parsed items
            const idCounts = {};
            const duplicates = [];
            for (var i = 0; i < parsedItems.length - 1; i++) {
                var item1 = parsedItems[i].track.id;
                var item2 = parsedItems[i + 1].track.id;
    
                if (item1 && item2 && item1.localeCompare(item2) === 0) {
                    // Initialize the count for this id if it hasn't been initialized yet
                    if (!idCounts[parsedItems[i + 1]]) {
                        idCounts[parsedItems[i + 1]] = 0;
                    }
                    idCounts[parsedItems[i + 1]] += 1;
                    duplicates.push(parsedItems[i + 1]);
                }
            }

            // console.log(duplicates); // Log the duplicates
            // console.log(idCounts); // Log the count dictionary
            for (var item in duplicates){
                console.log(duplicates[item], idCounts[item])
            }
        }
    }

    useEffect(() => {

    }, []);

    return <button onClick={handleCheckDuplicate}>Check Duplicate</button>
}

export default CheckDuplicate;
