import * as mockdata from './mockdata.js';
import * as db from "./database.js";

const URL = "http://localhost:4444";
const headerFields = { "Accept": "application/json" };

function showView(viewID) {
    document.querySelectorAll(".view").forEach(function (view) {
        view.style.display = "none";
      });
      // Show the requested view
      document.getElementById(viewID).style.display = "block";
}

function renderPlaylistPage(playlistName) {
    // render playlist page
    return;
}

function renderHomePage() {
    const container = document.getElementById('playlistContainer');
    container.innerHTML = '';
    mockdata.playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');
        // structure may change depending on how we want to use data with the back end
        playlistElement.innerHTML = `
            <h2>${playlist.name}</h2>
            <p>by ${playlist.user}</p>
            <p>${playlist.genre}</p>
            <div>
                <span class="vote" id="upvote" onclick="vote(${playlist.id}, true)">👍</span>
                <span>${playlist.votes}</span>
                <span class="vote down" id="downvote" onclick="vote(${playlist.id}, false)">👎</span>
            </div>
        `;
        container.appendChild(playlistElement);
        playlistElement.addEventListener('click', function() {
            showView("playlistPage");
            renderPlaylistPage(playlist.name);
        });
    });
}

function renderLoginPage() {
    // TODO: render login page
    return;
}

//This function needs DB to function
async function login(username, password) {
    //await db.attemptLogin(username, password);
}

window.vote = (playlistId, isUpvote) => {
    const playlist = mockdata.playlists.find(p => p.id === playlistId);
    if (playlist) {
        isUpvote ? playlist.votes++ : playlist.votes--;
        renderHomePage();
    }
};

const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", function() {
    console.log("Login Screen Loading");
    showView("loginPage");
    //renderLoginPage();
});

const submitBtn = document.getElementById("submit")
submitBtn.addEventListener("click", function() {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    //login(usernameField.value, passwordField.value);
    showView("userProfilePage");
    //TODO: add renderUserProfile when said function is made
});

const appTitle = document.getElementById("appTitle");
appTitle.addEventListener("click", function() {
    showView("homePage");
    renderHomePage();
});

//Function is assuming getSpotifyJSON() is returning an endpoint from /me/playlists
async function createUser(){
    const tempJSON = getSpotifyJSON();
    userJSON = {
        "id": tempJSON.items[0].owner.id,
        "name": tempJSON.items[0].owner.display_name,
        "playlists": tempJSON.items
    };
    await db.saveUser(userJSON.id, userJSON);
    fetch('URL', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userJSON)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

showView("homePage");
renderHomePage();