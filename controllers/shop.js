const Product = require("../models/product");
//const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    }).catch((err) => console.log(err.message));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  // Product.findOne({ where: { id: productId } })
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product,
  //       docTitle: product.title,
  //       path: `/products`,
  //     });
  //   }).catch(err => console.log(err.message));


  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: `/products`,
      });
    })
    .catch(err => console.log(err.message));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/",
      });
    }).catch((err) => console.log(err.message));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err.message));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then(orders => {
      res.render("shop/orders", {
        docTitle: "My Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch(err => console.log(err.message));
};


exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        products: products
      });
    })
    .catch(err => console.log(err.message));

};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId).then((product) => {
    return req.user.addToCart(product);
  })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    }).catch(err => console.log(err.message));

};


exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId.trim();
  req.user.deleteItemFromCart(productId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err.message));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/chekout", { docTitle: "Checkout", path: "/checkout" });
// };


