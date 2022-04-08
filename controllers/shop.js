const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    }).catch((err) => console.log(err.message))
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findOne({ where: { id: productId } })
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: `/products`,
      });
    }).catch(err => console.log(err.message))


  // Product.findById(productId)
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product,
  //       docTitle: product.title,
  //       path: `/products`,
  //     });
  //   })
  //   .catch(err => console.log(err.message));
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/",
      });
    }).catch((err) => console.log(err.message))
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }))
        })
        .catch(err => console.log(err.message));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch((err) => console.log(err.message))
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      //console.log(orders);
      res.render("shop/orders", {
        docTitle: "My Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch(err => console.log(err.message))

};


exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      console.log(cart);
      return cart.getProducts()
        .then(products => {
          res.render("shop/cart", {
            docTitle: "My Cart",
            path: "/cart",
            products: products
          });

        }).catch(err => console.log(err.message))
    })
    .catch(err => console.log(err.message))

};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findOne({ where: { id: productId } })
      // return Product.findOne({ where: { id: productId } })
      //   .then(selectedProduct => {
      //     return fetchedCart.addProduct(selectedProduct, {
      //       through: { quantity: newQuantity }
      //     });

      //   }).catch(err => console.log(err.message))
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err.message))

  // Product.findById(productId.trim(), product => {
  //   Cart.addProduct(productId.trim(), product.price);
  // });

};


exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId.trim();
  req.user.getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy()
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err.message))
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/chekout", { docTitle: "Checkout", path: "/checkout" });
};


