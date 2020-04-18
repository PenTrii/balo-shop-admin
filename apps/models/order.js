var mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    day: {
        type: Date,
    },
    idu: {
        type: String,
    },
    total: {
        type: Number,
    },
    address: {
        type: String,
    },
    status: {
        type: Number,
    }
});

const order = mongoose.model('orders', orderSchema);

module.exports = order;
