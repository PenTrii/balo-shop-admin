var mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nameproduct: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    idcategory: {
        type: String,
    },
    material: {
        type: String,
    },
    point: {
        type: Number,
    },
    size: {
        type: String,
    },
    warranty: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    view: {
        type: Number,
    },
    img: {
        type: [String],
    },
});

const product = mongoose.model('products', productSchema);

module.exports = product;
