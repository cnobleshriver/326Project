import * as mockdata from './mockdata.js';
// import PouchDB from "pouchdb";

// const db = new PouchDB("profiles");
const loginBtn = document.getElementById("loginBtn");
const submitBtn = document.getElementById("submit");
const navbarLogo = document.getElementById("navbarLogo");

/**
 * Shows the view with the given ID by setting its display style to 'block',
 * and hides all other views by setting their display style to 'none'.
 * @param {string} viewID - The ID of the view to show.
 */
function showView(viewID) {
    document.querySelectorAll(".view").forEach(function (view) {
        view.style.display = "none";
    });
    document.getElementById(viewID).style.display = "block";
}

/**
 * Renders the playlist page for the given playlist name.
 * @param {string} playlistName - The name of the playlist to render.
 */
function renderPlaylistPage(playlistName) {
    // render playlist page
    return;
}

/**
 * Renders the home page by displaying all playlists in the mock data.
 */
function renderHomePage() {
    const container = document.getElementById('playlistContainer');
    container.innerHTML = '';
    mockdata.playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');
        playlistElement.innerHTML = `
            <h2>${playlist.name}</h2>
            <p>by ${playlist.user}</p>
            <p>${playlist.genre}</p>
            <div>
                <span class="vote" onclick="vote(${playlist.id}, true)">👍</span>
                <span>${playlist.votes}</span>
                <span class="vote down" onclick="vote(${playlist.id}, false)">👎</span>
            </div>
        `;
        container.appendChild(playlistElement);
        playlistElement.addEventListener('click', function () {
            showView("playlistPage");
            renderPlaylistPage(playlist.name);
        });
    });
}

/**
 * Renders the login page.
 */
function renderLoginPage() {
    // TODO: render login page
    return;
}

/**
 * Logs in a user with the given username and password.
 * @param {string} username - The username of the user to log in.
 * @param {string} password - The password of the user to log in.
 */
async function login(username, password) {
    //await db.attemptLogin(username, password);
}

/**
 * Votes for a playlist with the given ID.
 * @param {string} playlistId - The ID of the playlist to vote for.
 * @param {boolean} isUpvote - Whether the vote is an upvote or a downvote.
 */
window.vote = (playlistId, isUpvote) => {
    const playlist = mockdata.playlists.find(p => p.id === playlistId);
    if (playlist) {
        isUpvote ? playlist.votes++ : playlist.votes--;
        renderHomePage();
    }
};

// Event listeners
loginBtn.addEventListener("click", function () {
    console.log("Login Screen Loading");
    showView("loginPage");
    //renderLoginPage();
});
submitBtn.addEventListener("click", function () {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    //login(usernameField.value, passwordField.value);
    showView("userProfilePage");
    //TODO: add renderUserProfile when said function is made
});
navbarLogo.addEventListener("click", function () {
    showView("homePage");
    renderHomePage();
});

// Initial view setup: show the home page and render it.
showView("homePage");
renderHomePage();