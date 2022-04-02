
exports.getAddProduct= (req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "add-product.html"));
    //res.render('add-product',{docTitle:"Add Product",path:'/admin/add-product',activeAddProduct:true,formCSS:true,productCSS:true});
    res.render('add-product',{docTitle:"Add Product",path:'/admin/add-product',activeAddProduct:true,});
};