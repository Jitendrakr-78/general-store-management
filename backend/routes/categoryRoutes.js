<<<<<<< HEAD
const express = require("express");

const router = express.Router();

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");


// GET all

router.get("/", getCategories);


// GET one

router.get("/:id", getCategoryById);


// CREATE

router.post("/", createCategory);


// UPDATE

router.put("/:id", updateCategory);


// DELETE

router.delete("/:id", deleteCategory);


module.exports = router;
=======
const express = require("express");

const router = express.Router();

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");


// GET all

router.get("/", getCategories);


// GET one

router.get("/:id", getCategoryById);


// CREATE

router.post("/", createCategory);


// UPDATE

router.put("/:id", updateCategory);


// DELETE

router.delete("/:id", deleteCategory);


module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
