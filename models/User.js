const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = Schema({
    telegram_id: String,
    username: String,
    name: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    timezone: String,
    language: String,
    lastActivity: Number
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;