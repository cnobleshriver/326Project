import * as mockdata from './mockdata.js';
const db = new PouchDB('users');

const loginBtn = document.getElementById("loginBtn");
const submitBtn = document.getElementById("submit");
const navbarLogo = document.getElementById("navbarLogo");
const loginForm = document.querySelector('#loginPage form');

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
                <span class="vote up">👍</span>
                <span>${playlist.votes}</span>
                <span class="vote down">👎</span>
            </div>
        `;
        container.appendChild(playlistElement);

        const upvoteButton = playlistElement.querySelector('.vote.up');
        const downvoteButton = playlistElement.querySelector('.vote.down');

        upvoteButton.addEventListener('click', function(event) {
            event.stopPropagation();
            window.vote(playlist.id, true);
        });

        downvoteButton.addEventListener('click', function(event) {
            event.stopPropagation();
            window.vote(playlist.id, false);
        });

        const playlistHeader = playlistElement.querySelector('h2');
        playlistHeader.addEventListener('click', function () {
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
    try {
        const user = await db.get(username);
        if (user.password === password) {
            return 'Login successful';
        } else {
            return 'Invalid password';
        }
    } catch (error) {
        return 'User does not exist';
    }
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

submitBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const message = await login(usernameField.value, passwordField.value);
    alert(message);
    if (message === 'Login successful') {
        showView("userProfilePage");
        //TODO: add renderUserProfile when said function is made
    }
});

navbarLogo.addEventListener("click", function () {
    showView("homePage");
    renderHomePage();
});

// Initial view setup: show the home page and render it.
showView("homePage");
renderHomePage();