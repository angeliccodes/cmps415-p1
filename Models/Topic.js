const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    // T8: Statistics on number of times accessed
    accessCount: { 
        type: Number, 
        default: 0 
    }, 
    // The Observer that checks users listening to this topic
    subscribers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }] 
});

module.exports = mongoose.model('Topic', topicSchema);