const express = require("express");

const productController = require("../controllers/productController.js");

const router = express.Router();

router.post("/add-product", productController.addProduct);

router.get("/all-products", productController.fetchProducts);

router.get("/fetch-ratings/:productId", productController.fetchProductRatings);

router.get("/fetch-comments/:productId", productController.fetchProductComments);

router.get("/fetch-products/:productName", productController.fetchProductsByName);

router.get("/fetch-product/:productId", productController.fetchProductById);

router.put("/update-product/:productId", productController.updateProduct);

router.delete("/delete-product/:productId", productController.deleteProduct);

module.exports = router;