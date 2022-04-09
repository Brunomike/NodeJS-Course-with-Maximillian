const mongodb = require('mongodb');
const Product = require("../models/product");

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const newProduct = new Product(title, price, imageUrl, description,null,req.user._id);

  newProduct.save().then(result => {
    //console.log(result);
    console.log('Product created successfully!');
    res.redirect('/admin/products');
  })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      });
    }).catch(err => console.log(err.message));
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, id } = req.body;
  const product = new Product(title, price, imageUrl, description, new ObjectId(id));

  product.save()
    .then(result => {
      console.log('Product updated successfully');
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err.message));

};


exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.deleteById(productId)
    .then(() => {
      res.redirect('/admin/products');
    }).catch(err => console.log(err.message));

};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    }).catch(err => console.log(err.message))
}