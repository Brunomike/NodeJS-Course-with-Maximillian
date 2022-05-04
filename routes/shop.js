const router = require("express").Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.post("/create-order",shopController.postOrder);
router.get("/orders", shopController.getOrders);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
