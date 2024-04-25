import * as mockdata from './mockdata.js';
const db = new PouchDB('users');

const loginBtn = document.getElementById("loginBtn");
const navbarLogo = document.getElementById("navbarLogo");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const signupLink = document.querySelector("#loginPage a");

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
            return "Login successful";
        } else {
            return "Invalid password";
        }
    } catch (error) {
        return "User does not exist";
    }
}

/**
 * This asynchronous function is used to sign up a new user.
 *
 * @param {string} username - The username of the user. This will be used as the unique identifier (_id) for the user in the database.
 * @param {string} password - The password of the user. This will be stored in the database.
 *
 * @returns {Promise<string>} A promise that resolves to a string message indicating the result of the signup operation.
 *
 * @throws {Error} If the user already exists or there is an error registering the user, it throws an error.
 */
async function signup(username, password) {
    const user = {
        _id: username,
        password: password
    };

    try {
        const existingUser = await db.get(user._id);
        if (existingUser && existingUser._id) {
            throw new Error('User already exists');
        }
    } catch (error) {
        if (error.name === 'not_found') {
            try {
                const response = await db.put(user);
                return 'User registered successfully';
            } catch (putError) {
                throw new Error('Error registering user');
            }
        } else {
            throw error;
        }
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

signupLink.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
});

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const usernameField = document.getElementById("signupUsername");
    const passwordField = document.getElementById("signupPassword");
    const message = await signup(usernameField.value, passwordField.value);
    alert(message);
    if (message === "User registered successfully") {
        document.getElementById('signupPage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'block';
    }
});

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const message = await login(usernameField.value, passwordField.value);
    alert(message);
    if (message === "Login successful") {
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