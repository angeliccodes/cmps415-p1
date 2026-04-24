const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    // The topics this user is observing
    subscribedTopics: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Topic' 
    }] 
});

module.exports = mongoose.model('User', userSchema);