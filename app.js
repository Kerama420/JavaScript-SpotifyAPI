// Spotify API Configuration
const clientId = '43b591551e6242169e1eb09919c034f2'; // Replace with your Spotify Client ID
const clientSecret = '375ea26c73c64f889e17fb5cffee086b'; // Replace with your Spotify Client Secret

// Get Spotify Access Token
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

// Search Tracks
async function searchTracks(query) {
   const token = await getAccessToken();
   const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

   const response = await fetch(searchUrl, {
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
   trackList.innerHTML = ''; // Clear previous results

   tracks.forEach(track => {
       const listItem = document.createElement('div');
       listItem.className = 'list-group-item';
       listItem.textContent = `${track.name} by ${track.artists[0].name}`;
       listItem.addEventListener('click', () => showTrackDetails(track));
       trackList.appendChild(listItem);
   });
}

// Show Track Details
function showTrackDetails(track) {
   const detailsDiv = document.getElementById('track_details');
   detailsDiv.innerHTML = `
       <h3>${track.name}</h3>
       <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
       <button onclick="addToFavorites('${track.name}', '${track.artists[0].name}')">Add to Favorites</button>
       <button onclick="addToPlaylist('${track.name}', '${track.artists[0].name}')">Add to Playlist</button>
   `;
}

// Add to Favorites
const favorites = [];
function addToFavorites(name, artist) {
   favorites.push({ name, artist });
   displayFavorites();
}

// Add to Playlist
const customPlaylists = {};
function addToPlaylist(name, artist) {
   const playlistName = prompt('Enter playlist name:');
   if (playlistName) {
       if (!customPlaylists[playlistName]) {
           customPlaylists[playlistName] = [];
       }
       customPlaylists[playlistName].push({ name, artist });
       displayPlaylists();
   }
}

// Create New Playlist
function createNewPlaylist() {
   const playlistName = prompt('Enter a name for your new playlist:');
   if (playlistName) {
       if (!customPlaylists[playlistName]) {
           customPlaylists[playlistName] = [];
           displayPlaylists();
       } else {
           alert('A playlist with this name already exists.');
       }
   }
}

// Display Favorites
function displayFavorites() {
   const favoritesDiv = document.getElementById('favorites');
   favoritesDiv.innerHTML = favorites
       .map(fav => `<p>${fav.name} by ${fav.artist}</p>`)
       .join('');
}

// Display Playlists
function displayPlaylists() {
   const playlistsDiv = document.getElementById('custom_playlist');
   playlistsDiv.innerHTML = Object.entries(customPlaylists)
       .map(([playlistName, tracks]) => `
           <h4>${playlistName}</h4>
           ${tracks.map(track => `<p>${track.name} by ${track.artist}</p>`).join('')}
       `)
       .join('');
}

// Attach Event Listeners
document.getElementById('btn_submit').addEventListener('click', (event) => {
   event.preventDefault();
   const query = document.getElementById('search_input').value;
   if (query) searchTracks(query);
});

document.getElementById('create_playlist').addEventListener('click', () => {
   createNewPlaylist();
});
