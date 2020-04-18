var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const utilitiesSchema = new mongoose.Schema({
    products: [{
        promotion: {type: Number},
        _id: {type: ObjectId}
    }],
    name: {
        type: String,
    }, 
    img: {
        type: String
    }
});

const utilities = mongoose.model('utilities', utilitiesSchema);

module.exports = utilities;