import * as mockdata from './mockdata.js';

function showView(viewID) {
    document.querySelectorAll(".view").forEach(function (view) {
        view.style.display = "none";
      });
      // Show the requested view
      document.getElementById(viewID).style.display = "block";
}

document.getElementById("homePage").addEventListener("click", function () {
    showView("homePage");
    renderPlaylists();
});
  
document.getElementById("loginPage").addEventListener("click", function () {
    showView("loginPage");
});
  
document.getElementById("userProfilePage").addEventListener("click", function () {
    showView("userProfilePage");
});

document.getElementById("playlistPage").addEventListener("click", function () {
    showView("playlistPage");
});

function renderPlaylists() {
    const container = document.getElementById('playlistContainer');
    container.innerHTML = '';
    mockdata.playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');
        playlistElement.addEventListener('click', function() {
            renderPlaylistPage(playlist.name);
        });
        // structure may change depending on how we want to use data with the back end
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
    });
}

window.vote = (playlistId, isUpvote) => {
    const playlist = mockdata.playlists.find(p => p.id === playlistId);
    if (playlist) {
        isUpvote ? playlist.votes++ : playlist.votes--;
        renderPlaylists();
    }
};

showView("homePage");
renderPlaylists();