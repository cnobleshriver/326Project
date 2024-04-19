document.addEventListener('DOMContentLoaded', () => {
    const playlists = [
        { id: 1, name: 'Playlist 1', user: 'user101', genre: 'Hip-hop', votes: 25 },
        { id: 2, name: 'Playlist 2', user: 'user102', genre: 'Rock', votes: 21 },
    ];

    function renderPlaylists() {
        const container = document.getElementById('playlistContainer');
        container.innerHTML = '';

        playlists.forEach(playlist => {
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
        });
    }

    window.vote = (playlistId, isUpvote) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            isUpvote ? playlist.votes++ : playlist.votes--;
            renderPlaylists();
        }
    };

    renderPlaylists();
});