const express = require("express");
const productController = require("../apps/controllers/product");
const categoryController = require("../apps/controllers/category");
const orderController = require("../apps/controllers/order");
const userController = require("../apps/controllers/user");
const loginController = require("../apps/controllers/login");
const utilitiController = require("../apps/controllers/utiliti");

// middleware function to check for logged-in users
var sessionChecker = async(req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {        
        res.redirect('/admin/login');
    }    
};

const router = express.Router();

router.get("/", sessionChecker, function(req, res) {
    res.redirect('/login');
});
//Product
router.get("/product", sessionChecker, productController.getListProduct);
router.get("/product/delete-product/:idp", sessionChecker, productController.getDeleteProductById);
router.get("/product/view-product/:idp", sessionChecker, productController.getViewProductById);
router.get("/product/add-product", sessionChecker, productController.getAddProduct);
router.get("/product/add-product-utiliti/:idp", sessionChecker, productController.getAddProductUtiliti);
router.post("/product/add-product-utiliti/:idp", productController.postAddProductUtiliti);
router.post("/product/add-product", productController.postAddProduct);
router.get("/product/edit-product/:idp", sessionChecker, productController.getEditProduct);
router.post("/product/edit-product/:idp", productController.postEditProduct);

//Category
router.get("/category", sessionChecker, categoryController.getListCategory);
router.get("/category/add-category", sessionChecker, categoryController.getAddCategory);
router.post("/category/add-category", categoryController.postAddCategory);
router.get("/category/delete-category/:idc", sessionChecker, categoryController.getDeleteCategoryById);
router.get("/category/view-category/:idc", sessionChecker, categoryController.getViewCategoryById);
router.get("/category/edit-category/:idc", sessionChecker, categoryController.getEditCategoryById);
router.post("/category/edit-category/:idc", sessionChecker, categoryController.postEditCategoryById);

//User
router.get("/user", sessionChecker, userController.getListUser);
router.get("/user/:idu/push-notification", sessionChecker, userController.getPushNotification);
router.post("/user/:idu/push-notification/:tokenID", userController.postSendFcmNotification);
//EndUser

//Login
router.get("/login", loginController.getLogin);
router.post("/login", loginController.postLogin);
router.get("/logout", loginController.getLogout);
//end Login

//Order
router.get("/order", sessionChecker, orderController.getListOrder);
router.get("/order/:statusId", sessionChecker, orderController.getListOrderByStatus);
router.get("/order/delete-order/:ido", sessionChecker, orderController.getDeleteOrderById);
router.get("/order/view-order/:ido", sessionChecker, orderController.getListOrderById);
router.get("/order/view-order/:ido/orderdetail/:idordetail", sessionChecker, orderController.getDeleteOrderDetailById);
router.get("/order/edit-status-order/:ido", sessionChecker, orderController.getEditStatusOrderByID);
router.post("/order/edit-status-order/:ido", orderController.postEditStatusOrderByID);

//Utiliti
router.get("/utiliti", sessionChecker, utilitiController.getListUtiliti);
router.get("/utiliti/add-utiliti", sessionChecker, utilitiController.getAddUtiliti);
router.post("/utiliti/add-utiliti", utilitiController.postAddUtiliti);
router.get("/utiliti/delete-utiliti/:iduti", sessionChecker, utilitiController.getDeleteUtiliti);
router.get("/utiliti/view-utiliti/:iduti", sessionChecker, utilitiController.getViewUtilitiByID);
router.get("/utiliti/view-utiliti/:iduti/delete/:_idp", sessionChecker, utilitiController.getDeleteProductInUtiliti);
router.get("/utiliti/view-utiliti/:iduti/edit/:_idp", sessionChecker, utilitiController.getEditProductInUtiliti);
router.post("/utiliti/view-utiliti/:iduti/edit/:_idp", sessionChecker, utilitiController.postEditProductInUtiliti);
router.get("/utiliti/edit-utiliti/:iduti", sessionChecker, utilitiController.getEditUtilitiByID);
router.post("/utiliti/edit-utiliti/:iduti", sessionChecker, utilitiController.postEditUtilitiByID);

module.exports = router;