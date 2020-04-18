var utiliti = require('../models/utiliti');
var product = require('../models/product');
var slider = require('../models/slider');
const config = require("config");
const port = config.get("server.port");
const _id_slider = config.get("_id_slider");

var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//Api 
exports.getApiListUtiliti = async(req, res) => {
    utiliti.find(function(err, result) {
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
}

exports.getApiListUtilitiById = async(req, res) => {
    utiliti.aggregate([
        {$match: {'_id': ObjectId(req.params.iduti)}},
        {$unwind: "$products" },
        {
            $lookup: {
                'from': 'products',
                'localField': 'products._id',
                'foreignField': '_id',
                'as': 'productObjects'
            }
        }, {$unwind: "$productObjects" },
    ]).exec(function(err, result) {
            if (err) throw err;
            res.json(result);
    });
}

exports.getApiListUtilitiByIdProduct = async(req, res) => {
    utiliti.aggregate([
        {$unwind: "$products" },
        {$match: {'products._id': ObjectId(req.params._idp)}},
    ]).exec(function(err, result) {
            if (err) throw err;
            res.json(result);
    });
}

//Admin
exports.getListUtiliti = async(req, res) => {
    utiliti.find(function(err, result) {
        if (err) throw err;
        if (result) {
            res.render('utiliti/list-utiliti', {utilities: result})
        }
        else {
            res.send(JSON.stringify({
                error : 'Error',
            }));
        }
    });
}

exports.getAddUtiliti = async(req, res) => {
    res.render('utiliti/add-utiliti');
}

exports.postAddUtiliti = async(req, res) => {
    const file = req.files[0] || [];
    var url = "http://localhost:"+port+"/uploads/"+file.filename;
    var uti = new utiliti ({
        name: req.body.name,
        img: url,
        promotion: req.body.name,
    });
    utiliti.create(uti, function (err, db) {
        if (err) throw err;
        slider.findById(_id_slider).then((result) => {
            result.iduti.push(db._id);
            return result.save();
        }).then(() => {
            console.log("1 document utilities inserted");
            res.redirect('/admin/utiliti');
        }).catch(err => {throw err;});
    });
}

exports.getDeleteUtiliti = async(req, res) => {
    const uti = req.params.iduti;

    utiliti.findById(uti).then((result) => {
        result.products.forEach(element => {
            product.findById(element._id).then(pro => {
                pro.__v = 0;
                return pro.save();
            }).catch(err => {throw err;});
        });
    });
    
    utiliti.deleteOne({_id: uti}).then(() => {
        slider.updateOne(
            {_id: _id_slider}, 
            {$pull: {iduti: uti}},
            {multi: false},
            function(err) {
            if (err) throw err;
            else {
                res.redirect('/admin/utiliti');
            }
        });
        }).catch(err => {res.json({'message': 'Error delete category!'});
    });
}

exports.getViewUtilitiByID = async(req, res) => {
    let idps = [];
    let _idp = [];
    let promotions = [];
    let prods = [];
    let uti = await utiliti.findById(req.params.iduti);

    for (let i = 0; i < uti.products.length; i++) {
        idps.push(uti.products[i]._id);
        promotions.push(uti.products[i].promotion);
        _idp.push(uti.products[i]._id);
    }

    for (let i = 0; i < idps.length; i++) {
        let prod = await product.findById(idps[i]);
        prods.push(prod);
    }
    res.render("utiliti/view-utiliti", {products: prods, iduti: req.params.iduti, promotions: promotions});
};

exports.getEditUtilitiByID = async(req, res) => {
    let uti = await utiliti.findById(req.params.iduti);
    res.render("utiliti/edit-utiliti", {utiliti: uti});
};

exports.postEditUtilitiByID = async(req, res) => {
    const file = req.files[0];
    utiliti.findById(req.params.iduti).then(uti => {
        uti.name = req.body.nameuti;
        if (file) {
            uti.img = "http://localhost:"+port+"/uploads/"+file.filename;
        }
        return uti.save();
    }).then(result => {
        res.redirect("/admin/utiliti");
    }).catch(err => {throw err;});
};

exports.getDeleteProductInUtiliti = async(req, res) => {
    utiliti.updateOne(
        {_id: req.params.iduti},
        {$pull: {products: {_id: req.params._idp}}},
        {multi: false},
        function(err) {
            if (err) throw err;
            else {
                product.findById(req.params._idp).then(pro => {
                    pro.__v = 0;
                    return pro.save();
                }).catch(err => {throw err;});
                res.redirect('/admin/utiliti/view-utiliti/' + req.params.iduti);
            }
        }
    );
};

exports.getEditProductInUtiliti = async(req, res) => {
    utiliti.findOne(
        {_id: req.params.iduti},
        {products: {$elemMatch: {_id: req.params._idp}}},
        function(err, result) {
            if (err) throw err;
            else {
                res.render('utiliti/edit-product-utiliti', {
                    promotion: result.products[0].promotion,
                    iduti: req.params.iduti,
                    _idp: req.params._idp
                });
            }
        }
    );
}

exports.postEditProductInUtiliti = async(req, res) => {
    utiliti.findOne(
        {_id: req.params.iduti},
        {products: {$elemMatch: {_id: req.params._idp}}},
        function(err, result) {
            if (err) throw err;
            else {
                result.products[0].promotion = parseFloat(req.body.promotion);
                return result.save();
            }
        }
    ).then(() => {     
        res.redirect('/admin/utiliti/view-utiliti/' + req.params.iduti);
    });
}