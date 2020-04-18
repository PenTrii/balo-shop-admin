var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const slidersSchema = new mongoose.Schema({
    iduti: [{
        type: ObjectId,
    }],
    name: {
        type: String,
    }
});

const sliders = mongoose.model('sliders', slidersSchema);

module.exports = sliders;