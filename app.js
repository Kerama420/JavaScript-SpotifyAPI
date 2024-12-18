// Spotify API Configuration
const clientId = '43b591551e6242169e1eb09919c034f2'; // Replace with your Spotify Client ID
const clientSecret = '375ea26c73c64f889e17fb5cffee086b'; // Replace with your Spotify Client Secret

// Fetch Access Token
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
    listItem.className = 'list-group-item d-flex align-items-center';

    const img = document.createElement('img');
    img.src = track.album.images[0]?.url || 'default-image.jpg';
    img.alt = track.name;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.marginRight = '10px';

    const trackName = document.createElement('span');
    trackName.textContent = `${track.name} by ${track.artists[0].name}`;
    trackName.style.flexGrow = '1';

    listItem.appendChild(img);
    listItem.appendChild(trackName);

    listItem.addEventListener('click', () => showTrackDetails(track));
    trackList.appendChild(listItem);
  });
}

// Show Track Details
function showTrackDetails(track) {
  const detailsDiv = document.getElementById('track_details');
  detailsDiv.innerHTML = `
    <h4>${track.name}</h4>
    <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
    <img src="${track.album.images[0]?.url || 'default-image.jpg'}" alt="${track.name}" style="width:100px;height:100px;">
    <button onclick="addToFavorites('${track.name}')">Add to Favorites</button>
    <button onclick="addToPlaylist('${track.name}')">Add to Playlist</button>
  `;
}

// Add to Favorites
const favorites = [];
function addToFavorites(trackName) {
  favorites.push(trackName);
  updateFavorites();
}

// Update Favorites
function updateFavorites() {
  const favoritesDiv = document.getElementById('favorites');
  favoritesDiv.innerHTML = favorites.map(track => `<div>${track}</div>`).join('');
}

// Add to Playlist
const customPlaylists = {};
function addToPlaylist(trackName) {
  const playlistName = prompt('Enter playlist name:');
  if (playlistName) {
    if (!customPlaylists[playlistName]) {
      customPlaylists[playlistName] = [];
    }
    customPlaylists[playlistName].push(trackName);
    updatePlaylists();
  }
}

// Update Playlists
function updatePlaylists() {
  const playlistsDiv = document.getElementById('custom_playlists');
  playlistsDiv.innerHTML = Object.keys(customPlaylists)
    .map(
      playlist =>
        `<h4>${playlist}</h4><ul>${customPlaylists[playlist]
          .map(track => `<li>${track}</li>`)
          .join('')}</ul>`
    )
    .join('');
}

// Attach Event Listeners
document.getElementById('search_button').addEventListener('click', () => {
  const query = document.getElementById('search_input').value;
  if (query) searchTracks(query);
});
