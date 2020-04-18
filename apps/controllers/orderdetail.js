var product = require("../models/product");
var orderdetail = require("../models/orderdetail");
var buy = require("../models/buy");

//orderdetail
exports.getApiListOrderDetail = async(req, res) => {
    orderdetail.find(function (err, result) {
        if (err) throw err;
        if (result) {
            res.json(result);
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }));
        }
    });
};

exports.getApiListOrderDetailByIdo = async(req, res) => {
    try {
        orderdetail.aggregate([
            {$match: {'ido': req.params.ido}},
            {
                $lookup: {
                    'from': 'products',
                    'localField': 'idp',
                    'foreignField': '_id',
                    'as': 'productObjects'
                }
            }, {$unwind: "$productObjects"}
        ]).exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.getApiListOrderDetailByIdp = async(req, res) => {
    try {
        var ordetail = await orderdetail.find({idp: req.params.idp});
        res.json(ordetail);
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.postApiOrderDetail = async(req, res) => {
    try {
        var prod = await product.findById(req.body.idp);
        var ordetail = new orderdetail ({
            ido: req.body.ido,
            idp: req.body.idp,
            quantity: req.body.quantity
        });
        
        //update buys collection in database
        buy.findOne({idp: req.body.idp}).then(db => {
            db.total +=  parseInt(req.body.quantity);
            db.save();
        }).catch(err => {res.send(err)});
        
        if (prod.quantity >= req.body.quantity) {
            const sub = prod.quantity - req.body.quantity;
            orderdetail.create(ordetail, function (err, db) {
                if (err) throw err;
                console.log("1 document orderdetail inserted");
                res.send(db);
            });
            product.findById(req.body.idp).then(db => {
                db.quantity = sub;
                db.save();
            }).catch(err => {res.send(err)});
        }
        else {
            res.json({message: 'Error quantity product!!!'});
        }
    }
    catch (err) {
        res.json({message: err});
    }
};