var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});

const user = mongoose.model('users', userSchema);

module.exports = user;