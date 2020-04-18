var mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    _id: {
        type: Number
    }, 
    name: {
        type: String
    }
});

const status = mongoose.model('status', statusSchema);

module.exports = status;
