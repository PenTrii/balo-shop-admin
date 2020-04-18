var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const orderdetailSchema = new mongoose.Schema({
   idp: {
       type: ObjectId,
   },
   ido: {
       type: String,
   },
    quantity: {
       type: Number
    }
});

const orderdetail = mongoose.model('orderdetails', orderdetailSchema);

module.exports = orderdetail;