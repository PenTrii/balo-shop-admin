var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const buySchema = new mongoose.Schema({
    idp: {
        type: ObjectId,
    },
    total: {
        type: Number
    }
});

const buy = mongoose.model('buys', buySchema);

module.exports = buy;
