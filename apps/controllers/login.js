const user = require("../models/user");

exports.getLogin = async(req, res) => {
    res.render("login");
};

exports.postLogin = async(req, res) => {
    const acc = await user.findOne().where("email").equals(req.body.email);
    var pass = req.body.password;
    if (acc.email != "" && pass == acc.password) {
        req.session.user = acc;
        res.redirect("/admin/product");
    }
    else {
        res.json({"message": "Error email or password!!!"});
    }
};

exports.getLogout = async(req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/admin/');
    } else {
        res.redirect('/admin/login');
    }
};