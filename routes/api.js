const express = require("express");
const productController = require("../apps/controllers/product");
const categoryController = require("../apps/controllers/category");
const commentController = require("../apps/controllers/comment");
const orderController = require("../apps/controllers/order");
const orderdetailController = require("../apps/controllers/orderdetail");
const utilitiController = require("../apps/controllers/utiliti");
const sliderControler = require("../apps/controllers/slider");
const statusControler = require("../apps/controllers/status");

const router = express.Router();

//api
router.get("/",  function(req, res) {
    res.json({message: 'This is api page success!!!'})
});

//product

/**
 * @swagger
 * /product:
 *  get:
 *      tags: ['product']
 *      description: product get all
 *      parameters: [{
 *          name: page,
 *          in: query,
 *          type: number
 *      }, {
 *          name: name,
 *          in: query,
 *          type: String
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product", productController.getApiListProduct);

/**
 * @swagger
 * /product/sort/by-view:
 *  get:
 *      tags: ['product']
 *      description: product get all
 *      parameters: [{
 *          name: page,
 *          in: query,
 *          type: number
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product/sort/by-view", productController.getSortListProductByView);

/**
 * @swagger
 * /product/{idproduct}:
 *  get:
 *      tags: ['product']
 *      description: product get idp
 *      parameters: [{
 *          name: idproduct,
 *          in: path
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product/:productId", productController.getApiProductById);

/**
 * @swagger
 * /product:
 *  post:
 *      tags: ['product']
 *      description: Post product in application
 *      parameters: [{
 *          name: description,
 *          in: formData,
 *          type: string,
 *      }, {
 *          name: material,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: nameproduct,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: idcategory,
 *          in: formData,
 *          type: string,
 *      },{
 *          name: point,
 *          in: formData,
 *          type: number
 *      }, {
 *          name: price,
 *          in: formData,
 *          type: number
 *      }, {
 *          name: quantity,
 *          in: formData,
 *          type: number
 *      }, {
 *          name: size,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: warranty,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: img,
 *          in: formData,
 *          type: file
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.post("/product", productController.postApiProduct);

/**
 * @swagger
 * /product/{idproduct}:
 *  put:
 *      tags: ['product']
 *      description: Post product in application
 *      parameters: [{
 *          name: idproduct,
 *          in: path,
 *          type: string,
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.put("/product/:idp", productController.putApiViewProductById);

/**
 * @swagger
 * /product/idcategory/{idcategory}:
 *  get:
 *      tags: ['product']
 *      description: product get all with idcategory
 *      parameters: [{
 *          name: idcategory,
 *          in: path
 *      }, {
 *          name: page,
 *          in: query,
 *          type: number
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product/idcategory/:idc", productController.getApiListProductByIdCategory);

/**
 * @swagger
 * /product/idcategory/{idcategory}/sort-high-price:
 *  get:
 *      tags: ['product']
 *      description: product get all with idcategory
 *      parameters: [{
 *          name: idcategory,
 *          in: path
 *      }, {
 *          name: page,
 *          in: query,
 *          type: number
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product/idcategory/:idc/sort-high-price", productController.getApiListProductByIdCategorySortByHighPrice);

/**
 * @swagger
 * /product/idcategory/{idcategory}/sort-low-price:
 *  get:
 *      tags: ['product']
 *      description: product get all with idcategory
 *      parameters: [{
 *          name: idcategory,
 *          in: path
 *      }, {
 *          name: page,
 *          in: query,
 *          type: number
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product/idcategory/:idc/sort-low-price", productController.getApiListProductByIdCategorySortByLowPrice);

/**
 * @swagger
 * /product/sort/by-buy:
 *  get:
 *      tags: ['product']
 *      description: product get all
 *      parameters: [{
 *          name: page,
 *          in: query,
 *          type: number
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/product/sort/by-buy", productController.getSortListProductByBuy);

//category

/**
 * @swagger
 * /category:
 *  get:
 *      tags: ['category']
 *      description: category in product
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/category", categoryController.getApiListCategory);

//comment

/**
 * @swagger
 * /comment:
 *  get:
 *      tags: ['comment']
 *      description: comment in product
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/comment", commentController.getListComment);

/**
 * @swagger
 * /comment/idp/{idproduct}:
 *  get:
 *      tags: ['comment']
 *      description: comment in product
 *      parameters: [{
 *          name: idproduct,
 *          in: path
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/comment/idp/:idp", commentController.getListCommentByIdp);

/**
 * @swagger
 * /comment:
 *  post:
 *      tags: ['comment']
 *      description: Post product in application
 *      parameters: [{
 *          name: content,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: idp,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: point,
 *          in: formData,
 *          type: number
 *      }, {
 *          name: date,
 *          in: formData,
 *          type: String
 *      }, {
 *          name: idu,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: title,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: imgc,
 *          in: formData,
 *          type: file
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.post("/comment", commentController.postApiComment);

//order

/**
 * @swagger
 * /order:
 *  get:
 *      tags: ['order']
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/order", orderController.getApiListOrder);

/**
  * @swagger
  * /order/idu/{iduser}:
  *  get:
  *      tags: ['order']
  *      description: comment in product
  *      parameters: [{
  *          name: iduser,
  *          in: path
  *      }]
  *      responses:
  *          '200':
  *              description: A successful response
  */
router.get("/order/idu/:idu", orderController.getApiListOrderByIdu);

/**
  * @swagger
  * /order/idu/{iduser}/statusId/{statusId}:
  *  get:
  *      tags: ['order']
  *      description: comment in product
  *      parameters: [{
  *          name: iduser,
  *          in: path
  *      }, {
  *          name: statusId,
  *          in: path,
*            type: Number
  *      }]
  *      responses:
  *          '200':
  *              description: A successful response
  */
router.get("/order/idu/:idu/statusId/:statusId", orderController.getApiListOrderByIduAndStatusId);


 /**
  * @swagger
  * /order:
  *  post:
  *      tags: ['order']
  *      description: Post product in application
  *      parameters: [{
  *          name: idu,
  *          in: formData,
  *          type: string
  *      }, {
  *          name: day,
  *          in: formData,
  *          type: string
  *      }, {
  *          name: total,
  *          in: formData,
  *          type: number
  *      }, {
  *          name: address,
  *          in: formData,
  *          type: String
  *      }]
  *      responses:
  *          '200':
  *              description: A successful response
  */
router.post("/order", orderController.postApiOrder);

//orderdetail

/**
 * @swagger
 * /orderdetail:
 *  get:
 *      tags: ['orderdetail']
 *      description: comment in product
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/orderdetail", orderdetailController.getApiListOrderDetail);

/**
 * @swagger
 * /orderdetail/ido/{idorder}:
 *  get:
 *      tags: ['orderdetail']
 *      description: comment in product
 *      parameters: [{
 *          name: idorder,
 *          in: path
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/orderdetail/ido/:ido", orderdetailController.getApiListOrderDetailByIdo);

/**
 * @swagger
 * /orderdetail/idp/{idprod}:
 *  get:
 *      tags: ['orderdetail']
 *      description: comment in product
 *      parameters: [{
 *          name: idprod,
 *          in: path
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/orderdetail/idp/:idp", orderdetailController.getApiListOrderDetailByIdp);

/**
 * @swagger
 * /orderdetail:
 *  post:
 *      tags: ['orderdetail']
 *      description: Post product in application
 *      parameters: [{
 *          name: ido,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: idp,
 *          in: formData,
 *          type: string
 *      }, {
 *          name: quantity,
 *          in: formData,
 *          type: number
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.post("/orderdetail", orderdetailController.postApiOrderDetail);

//Utiliti
/**
 * @swagger
 * /utiliti:
 *  get:
 *      tags: ['utiliti']
 *      description: comment in utiliti
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/utiliti", utilitiController.getApiListUtiliti);

/**
 * @swagger
 * /utiliti/{iduti}:
 *  get:
 *      tags: ['utiliti']
 *      description: comment in utiliti
 *      parameters: [{
 *          name: iduti,
 *          in: path,
 *          type: string
 *      }]
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/utiliti/:iduti", utilitiController.getApiListUtilitiById);

router.get("/utiliti/idp/:_idp", utilitiController.getApiListUtilitiByIdProduct);


//Slider
/**
 * @swagger
 * /slider:
 *  get:
 *      tags: ['slider']
 *      description: comment in utiliti
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/slider", sliderControler.getApiListSlider);

//Status
/**
 * @swagger
 * /status:
 *  get:
 *      tags: ['status']
 *      description: comment in utiliti
 *      responses:
 *          '200':
 *              description: A successful response
 */
router.get("/status", statusControler.getApiListStatus);
//end api

module.exports = router;