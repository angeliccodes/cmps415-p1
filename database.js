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

        // Hardcoding the exact link to bypass the Render naming mismatch
        mongoose.connect('mongodb+srv://Angiesdata:Happypuppy123@cluster0.b1ykx7n.mongodb.net/AngiesMessageApp?appName=Cluster0')
            .then(() => {
                console.log('Successfully connected to the Society Pages Database');
            })
            .catch(err => {
                console.error('Database connection error:', err);
            });
    }
}

module.exports = new Database();