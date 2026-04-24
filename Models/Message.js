const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    topic: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Topic' 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Message', messageSchema);