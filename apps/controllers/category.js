var category = require("../models/category");
var product = require("../models/product");
const config = require("config");
const port = config.get("server.port");

//Category
exports.getApiListCategory = async(req, res) => {
    category.find(function (err, result) {
        if (err) throw err;
        if (result) {
            res.json(result);
        } else {
            res.send(JSON.stringify({
                error : 'Error',
            }));
        }
    });
};
//end category.

//Admin
exports.getListCategory = async(req, res) => {
    const name = req.query.name;
    let filter = {name: {$regex: '.*' + name + '.*', $options: 'i'}};
    if (!name) {
        filter = {};
    }

    category.find(filter)
        .then(category => {
            res.render('category/list-category', {
                category: category
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getAddCategory = async(req, res, next) => {
    res.render("category/add-category");
};

exports.postAddCategory = async(req, res, next) => {
    const file = req.files[0] || [];
    var url = "http://localhost:"+port+"/uploads/"+file.filename;
    var cate = new category ({
        name: req.body.namecategory,
        img: url
    });
    category.create(cate, function (err, db) {
        if (err) throw err;
        console.log("1 document category inserted");
        res.redirect('/admin/category');
    });
};

exports.getDeleteCategoryById = async(req, res, next) => {
    const idcate = req.params.idc;

    category.deleteOne({_id: idcate}).then(() => {
            res.redirect('/admin/category');
        }).catch(err => {res.json({'message': 'Error delete category!'});
    });
};

exports.getViewCategoryById = async(req, res) => {
    try {
        var cate = await category.findById(req.params.idc)
        var prod = await product.find().where("idcategory").equals(req.params.idc);
        res.render('category/view-category', {category: cate, prod: prod});
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.getEditCategoryById = async(req, res) => {
    const categ = await category.findById(req.params.idc);
    res.render("category/edit-category", {category: categ});
};

exports.postEditCategoryById = async(req, res) => {
    const file = req.files[0];
    category.findById(req.params.idc).then(categ => {
        categ.name = req.body.namecategory;
        if (file) {
            categ.img = "http://localhost:"+port+"/uploads/"+file.filename;
        }
        return categ.save();
    }).then(result => {
        res.redirect("/admin/category");
    }).catch(err => {throw err;});
};