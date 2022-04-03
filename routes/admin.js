const path = require("path");
const router = require("express").Router();

const adminController =require("../controllers/admin");

router.get("/add-product",adminController.getAddProduct);
router.post("/add-product",adminController.postAddProduct);
router.get("/edit-product/:productId",adminController.getEditProduct);
router.post("/edit-product/",adminController.postEditProduct);
router.post("/delete-product/:productId",adminController.postDeleteProduct);
router.get("/products",adminController.getProducts);

module.exports=router;

