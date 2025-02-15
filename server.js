const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname))); // Serve static files

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Load homepage
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
