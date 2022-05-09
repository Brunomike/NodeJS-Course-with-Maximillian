const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
const Product = require('../models/product');
const fileHelper = require('../utils/file');

const alertMessage = (req) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  return message;
};

exports.getAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    oldInput: {
      title: '',
      price: 0.00,
      description: '',
      imageUrl: '',
    },
    errorMessage: null,
    validationErrors: errors.array()
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const { title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  console.log(image);

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      errorMessage: 'Attached file is not an image!',
      editing: false,
      oldInput: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: [],
    }
    );
  }

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      errorMessage: errors.array()[0].msg,
      editing: false,
      oldInput: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: errors.array(),
    }
    );
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log({ POST_ADD_PRODUCT: err.message });
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      //return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const errors = validationResult(req);
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: null,
        validationErrors: errors.array()
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  //const updatedImageUrl = req.body.imageUrl;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      path: '/admin/edit-product',
      pageTitle: 'Edit Product',
      errorMessage: errors.array()[0].msg,
      editing: true,
      oldInput: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
      },
      validationErrors: errors.array(),
    }
    );
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      return product.save()
        .then(result => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return next(new Error('Product not found'));
    }
    fileHelper.deleteFile(product.imageUrl);
    return Product.deleteOne({ _id: prodId, userId: req.user._id })

  })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    }).catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });

};


exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return next(new Error('Product not found'));
    }
    fileHelper.deleteFile(product.imageUrl);
    return Product.deleteOne({ _id: prodId, userId: req.user._id })

  })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: "Success!" });
    }).catch(err => {
      res.status(500).json({ message: "Deleting product failed!" });
    });
};