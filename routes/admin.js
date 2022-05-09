const path = require("path");
const router = require("express").Router();
const { check, body } = require('express-validator');

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post("/add-product",
    [
        body('title')
            .trim()
            .isString()
            .isLength({ min: 3 })
            .withMessage('Title should be an alphanumeric with at least 3 characters'),
        body('price')
            .isFloat()
            .withMessage('Please enter a valid decimal number'),
        body('description')
            .trim()
            .isLength({ min: 5 })
            .withMessage('Enter a valid description')
    ],
    isAuth, adminController.postAddProduct);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product/",
    [
        body('title')
            .trim()
            .isString()
            .isLength({ min: 3 })
            .trim()
            .withMessage('Title should be an alphanumeric with at least 3 characters'),
        body('price')
            .isFloat()
            .withMessage('Please enter a valid decimal number'),      
        body('description')
            .isLength({ min: 5 })
            .trim()
            .withMessage('Enter a valid description')
    ],
    isAuth, adminController.postEditProduct);
router.post("/delete-product/:productId", isAuth, adminController.postDeleteProduct);
router.delete("/product/:productId", isAuth, adminController.deleteProduct);
router.get("/products", isAuth, adminController.getProducts);

module.exports = router;

