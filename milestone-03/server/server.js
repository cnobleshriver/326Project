const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const PouchDB = require('pouchdb');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new PouchDB('playlists');

const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

/**
 * Handles user login by exchanging the authorization code for an access token and user information.
 * @route POST /login
 * @param {string} req.body.code - Authorization code from Spotify
 * @returns {Object} - JSON containing access token, user name, and user profile picture
 */
app.post("/login", (req, res) => {
    const code = req.body.code;
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body.access_token;
        spotifyApi.setAccessToken(accessToken);

        return spotifyApi.getMe().then(userData => {
            res.json({
                accessToken: accessToken,
                userName: userData.body.display_name,
                userProfilePicture: userData.body.images[0] ? userData.body.images[0].url : ''
            });
        });
    }).catch(err => {
        res.sendStatus(400);
    });
});

/**
 * Refreshes the Spotify access token using the refresh token.
 * @route POST /refresh_token
 * @param {string} req.body.refreshToken - Refresh token from Spotify
 * @returns {Object} - JSON containing the new access token
 */
app.post("/refresh_token", (req, res) => {
    const refreshToken = req.body.refreshToken;
    spotifyApi.setRefreshToken(refreshToken);
    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.access_token,
        });
    }).catch(err => {
        res.sendStatus(400);
    });
});

/**
 * Adds a playlist to the database.
 * @route POST /add_playlist
 * @param {string} req.body.accessToken - Spotify access token
 * @param {string} req.body.playlistId - ID of the playlist to add
 * @returns {Object} - JSON message indicating success or error
 */
app.post("/add_playlist", (req, res) => {
    const { accessToken, playlistId } = req.body;
    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getPlaylist(playlistId)
        .then(data => {
            const playlist = {
                _id: data.body.id,
                name: data.body.name,
                owner: data.body.owner.display_name,
                tracks: data.body.tracks.total,
                href: data.body.external_urls.spotify,
                upvotes: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            return db.put(playlist);
        })
        .then(() => {
            res.status(201).json({ message: "Playlist added successfully" });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

/**
 * Retrieves all playlists from the database.
 * @route GET /playlists
 * @returns {Array<Object>} - Array of playlist documents
 */
app.get("/playlists", (req, res) => {
    db.allDocs({ include_docs: true })
        .then(result => {
            res.json(result.rows.map(row => row.doc));
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

/**
 * Upvotes a playlist in the database.
 * @route POST /upvote_playlist
 * @param {string} req.body.playlistId - ID of the playlist to upvote
 * @returns {Object} - JSON message indicating success or error
 */
app.post("/upvote_playlist", (req, res) => {
    const { playlistId } = req.body;

    db.get(playlistId).then(doc => {
        doc.upvotes += 1;
        doc.updatedAt = new Date();
        return db.put(doc);
    }).then(() => {
        res.status(200).json({ message: "Playlist upvoted successfully" });
    }).catch(err => {
        res.status(400).json({ error: err.message });
    });
});

/**
 * Starts the server and listens on port 3001.
 */
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
