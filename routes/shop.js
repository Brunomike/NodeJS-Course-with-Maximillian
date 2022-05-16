const router = require("express").Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/checkout", isAuth,shopController.getCheckout);
router.get("/checkout/success", isAuth,shopController.getCheckoutSuccess);
router.get("/checkout/cancel", isAuth,shopController.getCheckout);
//router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
