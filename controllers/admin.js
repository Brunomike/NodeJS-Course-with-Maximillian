const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save()
    .then(()=>{
      res.redirect("/");
    })
    .catch(err=>console.log(err.message));  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findById(productId.trim(), product => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  })
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, id } = req.body;
  const updatedProduct = new Product(id.trim(), title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect("/admin/products");
};


exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.delete(productId);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        prods: rows,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch(err => console.log(err.message));

}