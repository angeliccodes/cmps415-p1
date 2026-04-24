require('dotenv').config();
const express = require('express');
const session = require('express-session'); // We imported the session tool
const app = express();

// Turn on the Singleton Database
require('./database'); 

// Import your Auth Controller
const authController = require('./controllers/authController');
const topicController = require('./controllers/topicController');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Turn on the Session "Wristbands"
app.use(session({
    secret: 'cmps415-super-secret-key', 
    resave: false,
    saveUninitialized: false
}));

// --- ROUTES ---
app.get('/stats', topicController.getStats);

// 1. Visual Page Routes (These just load the HTML screens)
app.get('/', (req, res) => {
    res.redirect('/login'); // Send people straight to the login page
});

app.get('/login', (req, res) => {
    res.render('login'); // We will build this visual page next
});

app.get('/register', (req, res) => {
    res.render('register'); // We will build this visual page next
});
app.get('/dashboard', topicController.getDashboard);

// Topic routes
app.get('/topics', topicController.getAllTopics);
app.post('/topics', topicController.createTopic);
app.post('/topics/:id/subscribe', topicController.subscribe);
app.post('/topics/:id/unsubscribe', topicController.unsubscribe);

// 2. Action Routes will trigger the logic in the controller)
app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/logout', authController.logout);
app.get('/topics/:id', topicController.getSingleTopic);
app.post('/topics/:id/messages', topicController.postMessage);
app.post('/messages/:messageId/delete', topicController.deleteMessage);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});