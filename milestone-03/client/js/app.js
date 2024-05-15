/**
 * Spotify API Endpoints and Constants
 */
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const REDIRECT_URI = 'http://localhost:3000';
const CLIENT_ID = 'd438496e304746c49414f6282f0a9477';

document.addEventListener('DOMContentLoaded', () => {
    let url = AUTHORIZE;
    url += "?client_id=" + CLIENT_ID;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(REDIRECT_URI);
    url += "&scope=user-read-private user-read-email playlist-read-private";

    // Get the authorization code from the URL
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
        // If authorization code exists get an access token
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Access Token:', data.accessToken);
                console.log('User Name:', data.userName);
                console.log('User Profile Picture:', data.userProfilePicture);

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userProfilePicture', data.userProfilePicture);

                displayUser(data.userName, data.userProfilePicture);
                refreshPlaylists();
                refreshStoredPlaylists();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        // Display login button if no authorization code is found
        const loginButton = document.getElementById('login-button');
        loginButton.style.display = 'block';
        loginButton.addEventListener('click', () => {
            window.location = url; // Redirect to Spotify authorization page
        });
    }

    // Logout button event listener
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userProfilePicture');
        window.location.href = '/';
    });
});

/**
 * Display user information in the UI
 * @param {string} userName - The user's name
 * @param {string} userProfilePicture - The URL of the user's profile picture
 */
function displayUser(userName, userProfilePicture) {
    const userInfo = document.getElementById('user-info');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    userInfo.innerHTML = `
        <img src="${userProfilePicture}" alt="${userName}" class="profile-picture">
        <span class="user-name">${userName}</span>
    `;
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
}

/**
 * Refresh access token using refresh token
 */
function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    fetch('http://localhost:3001/refresh_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('accessToken', data.accessToken);
        })
        .catch((error) => {
            console.error('Error refreshing token:', error);
        });
}

// Call refreshToken periodically, every 50 minutes
setInterval(refreshToken, 50 * 60 * 1000);

/**
 * Function to call Spotify API
 * @param {string} method - The HTTP method to use (GET, POST, etc.)
 * @param {string} url - The URL to send the request to
 * @param {object} [body] - The request body
 * @param {function} callback - The callback function to handle the response
 */
function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
    xhr.send(body);
    xhr.onload = callback;
}

/**
 * Refresh playlists from Spotify
 */
function refreshPlaylists() {
    callApi("GET", PLAYLISTS, null, handlePlaylistsResponse);
}

/**
 * Handle response from Spotify playlists API
 */
function handlePlaylistsResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("playlists");
        data.items.forEach(item => addPlaylist(item));
        document.getElementById('playlists').value = "";
    } else if (this.status == 401) {
        refreshToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

/**
 * Add a playlist to the dropdown menu
 * @param {object} item - The playlist item
 */
function addPlaylist(item) {
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node);
}

/**
 * Remove all items from a dropdown menu
 * @param {string} elementId - The ID of the element to remove items from
 */
function removeAllItems(elementId) {
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

/**
 * Fetch tracks from the selected playlist
 */
function fetchTracks() {
    let playlist_id = document.getElementById("playlists").value;
    if (playlist_id.length > 0) {
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        callApi("GET", url, null, handleTracksResponse);
    }
}

/**
 * Handle response from Spotify tracks API
 */
function handleTracksResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("tracks");
        data.items.forEach((item, index) => addTrack(item, index));
    } else if (this.status == 401) {
        refreshToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

/**
 * Add a track to the dropdown menu
 * @param {object} item - The track item
 * @param {number} index - The index of the track
 */
function addTrack(item, index) {
    let node = document.createElement("option");
    node.value = index;
    node.innerHTML = item.track.name + " (" + item.track.artists[0].name + ")";
    document.getElementById("tracks").appendChild(node);
}

/**
 * Add a selected playlist to the server
 */
function addPlaylistToServer() {
    const accessToken = localStorage.getItem('accessToken');
    const playlistId = document.getElementById("playlists").value;

    if (playlistId) {
        fetch('http://localhost:3001/add_playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken, playlistId }),
        })
            .then(response => response.json())
            .then(data => {
                alert('Playlist added successfully!');
                refreshStoredPlaylists();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        alert('Please select a playlist first.');
    }
}

/**
 * Refresh stored playlists from the server
 */
function refreshStoredPlaylists() {
    fetch('http://localhost:3001/playlists')
        .then(response => response.json())
        .then(data => {
            console.log('Stored Playlists:', data);
            removeAllItems("stored-playlists");
            data.forEach(item => addStoredPlaylist(item));
        })
        .catch((error) => {
            console.error('Error fetching stored playlists:', error);
        });
}

/**
 * Add a stored playlist to the UI
 * @param {object} item - The playlist item
 */
function addStoredPlaylist(item) {
    let node = document.createElement("div");
    node.className = "playlist-item";
    node.innerHTML = `
        <div class="playlist-info">
            <h3>${item.name}</h3>
            <p>Owner: ${item.owner}</p>
            <p>Tracks: ${item.tracks}</p>
            <p>Upvotes: <span id="upvotes-${item._id}">${item.upvotes}</span></p>
            <a href="${item.href}" target="_blank">Open in Spotify</a>
        </div>
        <div class="playlist-actions">
            <button onclick="upvotePlaylist('${item._id}')">👍</button>
        </div>
    `;
    document.getElementById("stored-playlists").appendChild(node);
}

/**
 * Upvote a playlist on the server
 * @param {string} playlistId - The ID of the playlist to upvote
 */
function upvotePlaylist(playlistId) {
    fetch('http://localhost:3001/upvote_playlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId }),
    })
        .then(response => response.json())
        .then(() => {
            const upvoteCount = document.getElementById(`upvotes-${playlistId}`);
            upvoteCount.textContent = parseInt(upvoteCount.textContent) + 1;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
