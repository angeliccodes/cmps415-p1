const User = require('../models/User');

// Handle creating a new account
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send("Username already taken. Please go back and try another.");
        }

        // Make a new user and save them to the DB
        const newUser = new User({ username, password });
        await newUser.save();
        
        // Send them to the login page after making the account
        res.redirect('/login'); 
    } catch (error) {
        console.error(error);
        res.send("Error registering account.");
    }
};

// Handle logging in
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Look for a user with that exact username and password
        const user = await User.findOne({ username, password });
        
        if (user) {
            // Success! Save their ID in their session "wristband"
            req.session.userId = user._id;
            res.redirect('/dashboard'); 
        } else {
            res.send("Invalid username or password. Please go back and try again.");
        }
    } catch (error) {
        console.error(error);
        res.send("Error logging in.");
    }
};

// Handle logging out
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};