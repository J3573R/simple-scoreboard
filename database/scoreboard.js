const mongoose = require('mongoose');

const schema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    secret: String,
    name: String,
    score: Number,
});

module.exports = mongoose.model('scoreboard', schema);