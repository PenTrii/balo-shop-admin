var mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    point: {
        type: Number
    },
    title: {
        type: String
    },
    idu: {
        type: String
    },
    idp: {
        type: String
    },
    imgc: {
        type: [String],
    },
    content: {
        type: String
    }
});

const comment = mongoose.model('comments', commentSchema);

module.exports = comment;
