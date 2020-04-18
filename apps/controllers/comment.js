var product = require("../models/product");
var comment = require("../models/comment");

//comment

exports.getListComment = async(req, res) => {
    comment.find(function (err, result) {
       if (err) throw err;
       if (result) {
           res.json(result);
       } else {
           res.send(JSON.stringify({
               error: 'Error'
           }));
       }
    });
};

exports.getListCommentByIdp = async(req, res) => {
    try {
        var comm = await comment.find().where('idp').equals(req.params.idp);
        res.json(comm);
    }
    catch (err) {
        res.json({message: err});
    }
};

exports.postApiComment = async(req, res) => {
    var imgUrls = [];
    for (var i = 0; i < req.files.length; i++) {
        var file = req.files[i];
        imgUrls.push("http://localhost:4444/uploads/"+file.filename);
    }
    const day = new Date(req.body.date);
    var comm = new comment ({
        content: req.body.content,
        idp: req.body.idp,
        date: day,
        point: req.body.point,
        idu: req.body.idu,
        title: req.body.title,
        imgc: imgUrls
    });
    comment.create(comm, function (err, db) {
        if (err) throw err;
        let total = 0;
        comment.find({idp: db.idp}).then(result => {
            for (let i = 0; i < result.length; i++) {
                total += result[i].point;
            }
            let point = total / result.length;
            product.findById(req.body.idp).then(prod => {
                prod.point = point;
                return prod.save();
            }).then(() => {
                console.log("1 document comment inserted");
                res.send(db);
            }).catch(err => {throw err;});
        });
    });
};
//end comment