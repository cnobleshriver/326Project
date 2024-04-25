export const playlists = [
    { id: 1, name: 'Playlist 1', user: 'user101', genre: 'Hip-hop', votes: 25 },
    { id: 2, name: 'Playlist 2', user: 'user102', genre: 'Rock', votes: 21 },
];

// songs
export const song01 = {
    title: "ULT",
    artist: "Denzel Curry",
    dateAdded: "April 23, 2024",
    duration: "4:07",
    genre: "Hip-hop"
};
export const song02 = {
    title: "The Spins",
    artist: "Mac Miller",
    dateAdded: "April 23, 2024",
    duration: "3:15",
    genre: "Hip-hop"
};
export const song03 = {
    title: "Higher",
    artist: "Creed",
    dateAdded: "April 23, 2024",
    duration: "5:16",
    genre: "Rock"
};
export const song04 = {
    title: "Fade To Black (Remastered)",
    artist: "Metallica",
    dateAdded: "April 23, 2024",
    duration: "6:57",
    genre: "Rock"
};

// playlists
export const playlist01 = [
    song01,
    song02
];
export const playlist02 = [
    song03,
    song04
];

// user profiles
export const profile01 = {
    username: "User 01",
    password: "password",
    dateJoined: "April 1 2024",
    description: "A generic user",
    playlists: [playlist01, playlist02]
}