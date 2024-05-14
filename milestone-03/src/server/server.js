const express = require('express');
const path = require('path');

// Create an instance of Express
const app = express();

const indexPath = path.resolve(__dirname, '..', 'client');
app.use('/', express.static(indexPath));

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
