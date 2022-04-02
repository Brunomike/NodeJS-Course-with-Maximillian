const path = require("path");
const router = require("express").Router();

const rootDir = require("../utils/path");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  const products=adminData.products;  
  //res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render('shop',{
    prods:products,
    docTitle:'Shop',
    path:'/',    
    hasProducts:products.length>0,
    activeShop:true,
    productCSS:true
  });
});

module.exports = router;
