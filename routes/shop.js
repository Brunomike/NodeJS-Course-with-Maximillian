const router = require("express").Router();
const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);

module.exports = router;
