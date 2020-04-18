var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    img: {
        type: String
    }
});

const category = mongoose.model('categorys', categorySchema);

module.exports = category;
