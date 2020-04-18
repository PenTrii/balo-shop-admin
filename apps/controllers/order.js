var order = require("../models/order");
const orderDetails = require("../models/orderdetail");
const product = require("../models/product");
const firebase = require("firebase-admin");
const status = require("../models/status");
var db = firebase.database();
var ref = db.ref("users");


//Order

exports.getApiListOrder = async(req, res) => {
    order.find(function (err, result) {
       if (err) throw err;
       if (result) {
           res.json(result);
       }
       else {
           res.send(JSON.stringify({
               error : 'Error',
           }));
       }
    });
 };
 
 exports.getApiListOrderByIdu = async(req, res) => {
     try {
         var ord = await order.find({idu: req.params.idu});
         res.json(ord);
     }
     catch (err) {
         res.json({message: err});
     }
 };

 exports.getApiListOrderByIduAndStatusId = async(req, res) => {
    try {
        var ord = await order.find({idu: req.params.idu, status: req.params.statusId});
        res.json(ord);
    }
    catch (err) {
        res.json({message: err});
    }
};
 
 exports.postApiOrder = async(req, res) => {
    const date = new Date(req.body.day);
    var ord = new order ({
        idu: req.body.idu,
        day: date,
        total: req.body.total,
        address: req.body.address,
        status: 0
    });
    order.create(ord, function (err, db) {
       if (err) throw err;
        console.log("1 document order inserted");
        res.send(db);
    });
 };

 //admin
 exports.getListOrder = async(req, res, next) => {
    let emails = [];

    order.find(function(err, result) {
        if (err) throw err;
        if (result) {
        let days = [];
            ref.once("value").then(snapshot => {
                result.forEach(function (db) {
                    var d = new Date(db.day);
                    days.push(d.toLocaleDateString());
                    snapshot.forEach(function(childsnapshot) {
                        if (db.idu == childsnapshot.key) {
                            emails.push(childsnapshot.child("email").val());
                        }
                    });
                });
                res.render('order/list-order', {
                    order: result, email: emails, days: days
                });
            }).catch(err => {res.status(404).send(err)});
        }
        else {
            res.send(JSON.stringify({
                error : 'Error',
            }));
        }
    }).sort({'day': -1});
 };

 exports.getDeleteOrderById = async(req, res, next) => {
    const idorder = req.params.ido;

    order.deleteOne({_id: idorder}).then(() => {
        orderDetails.deleteMany({ido: idorder}).catch(err => {
            res.json({'message': 'Error delete product!'});
        });
        res.redirect('/admin/order');
        }).catch(err => {res.json({'message': 'Error delete product!'});
    });
};

exports.getListOrderById = async(req, res) => {
    try {
        var ord = await order.findById(req.params.ido);
        var orddetail = await orderDetails.find().where('ido').equals(req.params.ido);
        let idps = [];
        orddetail.forEach(function(result) {
            idps.push(result.idp);
        });
        let prods = [];
        for (let i = 0; i < idps.length; i++) {
            let prod = await product.findById(idps[i]);
            prods.push(prod);
        }
        res.render("order/view-order", {orders:ord, orddetail: orddetail , prod: prods});
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.getDeleteOrderDetailById = async(req, res) => {
    const idordetail = req.params.idordetail;

    orderDetails.deleteOne({_id: idordetail}).then(() => {    
        res.redirect('/admin/order/view-order/'+req.params.ido);
        }).catch(err => {res.json({'message': 'Error delete orderDetail!'});
    });
};

exports.getEditStatusOrderByID = async(req, res) => {
   try{
        var ord = await order.findById(req.params.ido);
        
        status.find(function (err, result) {
            if (err) throw err;
            if (result) {      
                res.render("order/edit-status-order", {order: ord, status: result});
            } else {
                res.send(JSON.stringify({
                    error : 'Error'
                }));
            }
        });
   }
   catch (err) {
        res.json({message: err});
    }
};

exports.postEditStatusOrderByID = async(req, res) => {
    order.findById(req.params.ido).then(ord => {
        ord.status = req.body.status;
        ord.address = req.body.address;
        return ord.save();
    }).then(result => {
        res.redirect("/admin/order");
    }).catch(err => {throw err;});
 };

 //get list  list bystatus
 exports.getListOrderByStatus = async(req, res) => {
    let emails = [];
    const statusID = req.params.statusId;
    order.find({status: req.params.statusId}, function(err, result) {
        if (err) throw err;
        if (result) {
        let days = [];
            ref.once("value").then(snapshot => {
                result.forEach(function (db) {
                    var d = new Date(db.day);
                    days.push(d.toLocaleDateString());
                    snapshot.forEach(function(childsnapshot) {
                        if (db.idu == childsnapshot.key) {
                            emails.push(childsnapshot.child("email").val());
                        }
                    });
                });
                res.render('order/list-order', {
                    order: result, email: emails, days: days
                });
            }).catch(err => {res.status(404).send(err)});
        }
        else {
            res.send(JSON.stringify({
                error : 'Error',
            }));
        }
    }).sort({'day': -1});
    // try {
    //     var ord = await order.find({status: req.params.statusId});
    //     console.log(ord)
    // }
    // catch (err) {
    //     res.json({message: err});
    // }
};
 
 //end order.