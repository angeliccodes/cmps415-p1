const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        // The Singleton logic: If we are already connected, don't connect again.
        if (mongoose.connection.readyState === 1) {
            console.log('Database already connected.');
            return;
        }

        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('Successfully connected to MongoDB Database');
            })
            .catch(err => {
                console.error('Database connection error:', err);
            });
    }
}

// By exporting a NEW instance of the class, Node.js caches it. 
// Any other file that asks for the database will get this exact same instance.
module.exports = new Database();