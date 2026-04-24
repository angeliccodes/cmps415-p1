const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        // The Singleton logic that if we are already connected, don't connect again.
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


module.exports = new Database();