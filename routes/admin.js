const path = require("path");
const router = require("express").Router();

const rootDir = require("../utils/path");

const products=[];

router.get("/add-product", (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  //res.render('add-product',{docTitle:"Add Product",path:'/admin/add-product',activeAddProduct:true,formCSS:true,productCSS:true});
  res.render('add-product',{docTitle:"Add Product",path:'/admin/add-product',activeAddProduct:true,});
});

router.post("/add-product", (req, res, next) => {
  products.push({title:req.body.title});
  //console.log(req.body);
  res.redirect("/");
});

exports.routes=router;
exports.products=products;

