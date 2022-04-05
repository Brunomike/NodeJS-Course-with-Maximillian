const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch(err => console.log(err.message));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        docTitle: product.title,
        path: `/products`,
      });
    })
    .catch(err => console.log(err.message));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch(err => console.log(err.message));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { docTitle: "My Orders", path: "/orders" });
};
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(p => p.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, quantity: cartProductData.quantity });
        }
      }
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        products: cartProducts
      });
    });
  });

};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId.trim(), product => {
    Cart.addProduct(productId.trim(), product.price);
  });
  res.redirect('/cart');
};


exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId.trim();;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });

};

exports.getCheckout = (req, res, next) => {
  res.render("shop/chekout", { docTitle: "Checkout", path: "/checkout" });
};


