<<<<<<< HEAD
const express = require("express");

const router = express.Router();


const {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");


// GET all suppliers

router.get(
    "/",
    getSuppliers
);


// GET one supplier

router.get(
    "/:id",
    getSupplierById
);


// CREATE

router.post(
    "/",
    createSupplier
);


// UPDATE

router.put(
    "/:id",
    updateSupplier
);


// DELETE

router.delete(
    "/:id",
    deleteSupplier
);


module.exports = router;
=======
const express = require("express");

const router = express.Router();


const {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");


// GET all suppliers

router.get(
    "/",
    getSuppliers
);


// GET one supplier

router.get(
    "/:id",
    getSupplierById
);


// CREATE

router.post(
    "/",
    createSupplier
);


// UPDATE

router.put(
    "/:id",
    updateSupplier
);


// DELETE

router.delete(
    "/:id",
    deleteSupplier
);


module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
