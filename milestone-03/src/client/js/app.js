import * as mockdata from './mockdata.js';
const db = new PouchDB('users');

const loginButton = document.getElementById('login-button')
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
                <span class="vote up">👍</span>
                <span>${playlist.votes}</span>
                <span class="vote down">👎</span>
            </div>
        `;
        container.appendChild(playlistElement);

        const upvoteButton = playlistElement.querySelector('.vote.up');
        const downvoteButton = playlistElement.querySelector('.vote.down');

        upvoteButton.addEventListener('click', function (event) {
            event.stopPropagation();
            window.vote(playlist.id, true);
        });

        downvoteButton.addEventListener('click', function (event) {
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
navbarLogo.addEventListener("click", function () {
    showView("homePage");
    renderHomePage();
});

// Initial view setup: show the home page and render it.
showView("homePage");
renderHomePage();