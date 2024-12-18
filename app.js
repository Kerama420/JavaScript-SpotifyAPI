const clientId = '43b591551e6242169e1eb09919c034f2'; // Replace with your Spotify Client ID
const clientSecret = '375ea26c73c64f889e17fb5cffee086b'; // Replace with your Spotify Client Secret

// Fetch Spotify Access Token
async function getAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

// Fetch Tracks
async function searchTracks(query) {
    const token = await getAccessToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    displayTracks(data.tracks.items);
}

// Display Tracks
function displayTracks(tracks) {
    const trackList = document.getElementById('track_list');
    trackList.innerHTML = '';

    tracks.forEach(track => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'list-group-item list-group-item-action';
        item.textContent = `${track.name} by ${track.artists[0].name}`;
        item.addEventListener('click', () => showTrackDetails(track));
        trackList.appendChild(item);
    });
}

// Show Track Details
function showTrackDetails(track) {
    const details = document.getElementById('track_details');
    details.innerHTML = `
        <h3>${track.name}</h3>
        <p>Artist: ${track.artists.map(a => a.name).join(', ')}</p>
        <img src="${track.album.images[0].url}" alt="${track.name}">
        <button class="btn btn-primary mt-2" onclick="addToFavorites('${track.id}')">Add to Favorites</button>
        <button class="btn btn-secondary mt-2" onclick="addToPlaylist('${track.id}')">Add to Playlist</button>
    `;
}

// Manage Favorites
const favorites = [];
function addToFavorites(trackId) {
    favorites.push(trackId);
    alert('Track added to favorites!');
    updateFavorites();
}

function updateFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = favorites.map(id => `<p>${id}</p>`).join('');
}

// Manage Playlists
const customPlaylists = {};
function addToPlaylist(trackId) {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName) {
        if (!customPlaylists[playlistName]) customPlaylists[playlistName] = [];
        customPlaylists[playlistName].push(trackId);
        alert(`Track added to playlist "${playlistName}"`);
        updatePlaylists();
    }
}

function updatePlaylists() {
    const playlistsDiv = document.getElementById('custom_playlist');
    playlistsDiv.innerHTML = Object.entries(customPlaylists)
        .map(([name, ids]) => `<h5>${name}</h5><p>${ids.join(', ')}</p>`)
        .join('');
}

// Search Button Event
document.getElementById('btn_submit').addEventListener('click', e => {
    e.preventDefault();
    const query = document.getElementById('search_input').value;
    if (query) searchTracks(query);
});
