require('dotenv').config(); 
const express = require('express');
const app = express();


require('./database'); 

// Middleware to read form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the view engine for the HTML pages
app.set('view engine', 'ejs');

// A simple test route
app.get('/', (req, res) => {
    res.send("Server and Database are running!");
});

// Start listening on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});