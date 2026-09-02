<<<<<<< HEAD
const express = require("express");

const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// CREATE product
router.post("/", createProduct);

// UPDATE product
router.put("/:id", updateProduct);

// DELETE product
router.delete("/:id", deleteProduct);

module.exports = router;
=======
const express = require("express");

const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// CREATE product
router.post("/", createProduct);

// UPDATE product
router.put("/:id", updateProduct);

// DELETE product
router.delete("/:id", deleteProduct);

module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
