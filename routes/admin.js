const path = require("path");
const router = require("express").Router();

const productsController =require("../controllers/products");
const rootDir = require("../utils/path");

const products=[];

router.get("/add-product",productsController.getAddProduct);

router.post("/add-product", (req, res, next) => {
  products.push({title:req.body.title});  
  res.redirect("/");
});

exports.routes=router;
exports.products=products;

