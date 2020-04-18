var product = require("../models/product");
var buy = require("../models/buy");
var utiliti = require('../models/utiliti');
var comment = require('../models/comment');
const category = require("../models/category");
const config = require("config");
const port = config.get("server.port");

var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//API
exports.getApiListProduct = async(req, res) => {
    var page = Math.max(0, req.query.page);
    var perPage = 6;
    const name = req.query.name;
    
    let filter = {nameproduct: {$regex: '.*' + name + '.*', $options: 'i'}};

    if (!name) {
        filter = {};
    }

    if  (!page) {
        product.find(filter).then(result => {
            if (result) {
                res.json(result);
            } else {
                res.send(JSON.stringify({
                    error : 'Error',
                }));
            }
        }).catch(err => {throw err});
    }
    else if (page && name) {
        product.find(filter)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                if (products) {
                    res.json(products);
                } else {
                    res.send(JSON.stringify({
                        error : err,
                    }));
                }
            });
    }
    else {
        product.find()
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                res.json(products);
            });
    }
};

exports.getApiProductById = async(req, res) => {
    try {
        var prod = await product.findById(req.params.productId);
        if (prod.__v == 0) {
            res.json(prod);
        }
        else if (prod.__v == 1) {
            utiliti.aggregate([
                {$unwind: '$products'},
                {$match: {'products._id': ObjectId(req.params.productId)}},
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products._id',
                        foreignField: '_id',
                        as: 'productObjects'
                    }, 
                },
                {$unwind: '$productObjects'},
                {$project: {
                    img:'$productObjects.img',
                    _id: '$productObjects._id',
                    description: '$productObjects.description',
                    material: '$productObjects.material',
                    nameproduct: '$productObjects.nameproduct',
                    idcategory: '$productObjects.idcategory',
                    point: '$productObjects.point',
                    price: '$productObjects.price',
                    quantity: '$productObjects.quantity',
                    size: '$productObjects.size',
                    warranty: '$productObjects.warranty',
                    view: '$productObjects.view ',
                    __v: '$productObjects.__v',
                    promotion: '$products.promotion'
                }},
            ]).exec(function(err, result) {
                    if (err) throw err;
                    res.send(result[0]);
            });
        }
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.getApiListProductByIdCategory = async(req, res) => {
    try {
        var page = Math.max(0, req.query.page);
        var perPage = 6;
    
        if  (!page) {
            var prod = await product.find().where('idcategory').equals(req.params.idc);
            res.json(prod);
        }
        else {
            product.find()
                .where('idcategory')
                .equals(req.params.idc)
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function(err, products) {
                    res.json(products);
                });
        }
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.postApiProduct = async(req, res) => {
    var imgUrls = [];
    for (var i = 0; i < req.files.length; i++) {
        var file = req.files[i];
        imgUrls.push("http://localhost:"+port+"/uploads/"+file.filename);
    }
    var prod = new product ({
        description: req.body.description,
        material: req.body.material,
        nameproduct: req.body.nameproduct,
        idcategory: req.body.idcategory,
        point: req.body.point,
        price: req.body.price,
        size: req.body.size,
        warranty: req.body.warranty,
        view: 0,
        img: imgUrls
    });
    product.create(prod, function (err, db) {
        if (err) throw err;
        console.log("1 document product inserted");
        var buyv = new buy ({
            idp: prod._id,
            quantity: 0
        });
        buy.create(buyv, function (err, result) {
            if (err) throw err;
            console.log("1 document buy inserted");
        });
        res.send(db);
    });
};

exports.putApiViewProductById = async(req, res) => {
    product.findById(req.params.idp).then(prod => {
        prod.view += 1;
        return prod.save();
    }).then(result => {
        res.json(result);
    }).catch(err => {throw err;});
};

exports.getSortListProductByView = async(req, res) => {
    var page = Math.max(0, req.query.page);
    var perPage = 5;

    if  (!page) {
        product.find().sort({view: -1}).exec(function(err, result) {
            if (err) return err;
            else 
                res.json(result);
        });
    }
    else {
        product.find()
            .sort({view: -1})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                res.json(products);
            });
    }
};

exports.getSortListProductByBuy = async(req, res) => {
    var page = Math.max(0, req.query.page);
    var perPage = 10;
    if  (!page) {
        buy.aggregate([
            {
                $lookup: {
                    'from': 'products',
                    'localField': 'idp',
                    'foreignField': '_id',
                    'as': 'products'
                }
            }
        ]).sort({total: -1})
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    }
    else {
        buy.aggregate([
            {
                $lookup: {
                    'from': 'products',
                    'localField': 'idp',
                    'foreignField': '_id',
                    'as': 'product'
                }
            }
        ]).sort({total: -1})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    }
};

exports.getApiListProductByIdCategorySortByHighPrice = async(req, res) => {
    try {
        var page = Math.max(0, req.query.page);
        var perPage = 6;
    
        if  (!page) {
            var prod = await product.find().where('idcategory').equals(req.params.idc).sort({'price': -1});
            res.json(prod);
        }
        else {
            product.find()
                .where('idcategory')
                .sort({'price': -1})
                .equals(req.params.idc)
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function(err, products) {
                    res.json(products);
                });
        }
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.getApiListProductByIdCategorySortByLowPrice = async(req, res) => {
    try {
        var page = Math.max(0, req.query.page);
        var perPage = 6;
    
        if  (!page) {
            var prod = await product.find().where('idcategory').equals(req.params.idc).sort({'price': 1});
            res.json(prod);
        }
        else {
            product.find()
                .where('idcategory')
                .sort({'price': 1})
                .equals(req.params.idc)
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function(err, products) {
                    res.json(products);
                });
        }
    }
    catch (err) {
        res.json({message: err});
    }
};

//End API

//Admin
exports.getListProduct = async(req, res, next) => {
    var page = req.query.page || 1;
    var perPage = 6;
    const name = req.query.name;
    let filter = {nameproduct: {$regex: '.*' + name + '.*', $options: 'i'}};
    if (!name) {
        filter = {};
    }

    product.find(filter)
            .sort({'_id': -1})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                product.find(filter).countDocuments().exec(function(err, count) {
                    var pages;
                    if ((count % perPage) < 6 && (count % perPage) > 0) {
                        pages = count / perPage + 1;
                    }
                    else {
                        pages = count / perPage;
                    }
                    res.render('product/list-product', {
                        products: products, 
                        page: page,
                        pages: pages,
                        name: name,
                    });
                });
            });
};

exports.getDeleteProductById = async(req, res, next) => {
    const idproduct = req.params.idp;

    buy.deleteOne({idp: idproduct});

    product.deleteOne({_id: idproduct}).then(() => {
        buy.deleteOne({idp: idproduct}).catch(err => res.json({'message': err}));
        res.redirect('/admin/product');
        }).catch(err => {res.json({'message': err});
    });
};

exports.getViewProductById = async(req, res) => {
    try {
        var prod = await product.findById(req.params.idp);
        var comm = await comment.find().where('idp').equals(req.params.idp);
        let url = [];
        for (let index = 0; index < prod.img.length; index++) {
            url.push(prod.img[index]);
        }
        res.render('product/view-product', {product: prod, url: url, reviews: comm.length});
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.getAddProduct = async(req, res, next) => {
    category.find(function (err, result) {
        if (err) throw err;
        if (result) {
            res.render("product/add-product", {categorys: result});
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }));
        }
    });
};

exports.postAddProduct = async(req, res, next) => {
    var imgUrls = [];
    for (var i = 0; i < req.files.length; i++) {
        var file = req.files[i];
        imgUrls.push("http://localhost:"+port+"/uploads/"+file.filename);
    }
    var prod = new product ({
        description: req.body.description,
        material: req.body.material,
        nameproduct: req.body.nameproduct,
        idcategory: req.body.idcategory,
        price: req.body.price,
        quantity: req.body.quantity,
        size: req.body.size,
        warranty: req.body.warranty,
        view: 0,
        point: 4.8,
        img: imgUrls
    });
    product.create(prod, function (err, db) {
        if (err) throw err;
        console.log("1 document product inserted");
        var buyv = new buy ({
            idp: prod._id,
            quantity: 0
        });
        buy.create(buyv, function (err, result) {
            if (err) throw err;
            console.log("1 document buy inserted");
        });
        res.redirect('/admin/product');
    });
};

exports.getAddProductUtiliti = async(req, res, next) => {
    var prod = await product.findById(req.params.idp);
    utiliti.find(function(err, result) {
        if (err) throw err;
        if (result) {
            res.render('product/add-product-utiliti', {product: prod, utilities: result});
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }));
        }
    });
};

exports.postAddProductUtiliti = async(req, res, next) => {
    var prodt = {
        promotion: parseFloat(req.body.promotion), 
        _id: req.params.idp
    }
    utiliti.findById(req.body.iduti).then(db => {
        db.products.push(prodt);
        return db.save();
    }).then(result => {
        product.findById(prodt._id).then(pro => {
            pro.__v = 1;
            return pro.save();
        }).then(() => {
            res.redirect("/admin/product");
        }).catch(err => {throw err;});
    }).catch(err => {throw err;});
};

exports.getEditProduct = async(req, res, next) => {
    try {
        var prod = await product.findById(req.params.idp);
        category.find(function (err, result) {
            if (err) throw err;
            if (result) {      
                res.render("product/edit-product", {product: prod, categorys: result});
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
}

exports.postEditProduct = async(req, res, next) => {
    product.findById(req.params.idp).then(prod => {
        prod.description = req.body.description;
        prod.material = req.body.material;
        prod.nameproduct = req.body.nameproduct;
        prod.idcategory = req.body.idcategory;
        prod.price = req.body.price;
        prod.quantity = req.body.quantity;
        prod.size = req.body.size;
        prod.warranty = req.body.warranty;
        return prod.save();
    }).then(result => {
        res.redirect("/admin/product");
    }).catch(err => {throw err;});
};
//End Admin
