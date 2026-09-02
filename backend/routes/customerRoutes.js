const express = require("express");

const router = express.Router();


const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");


// GET ALL

router.get(
    "/",
    getCustomers
);


// GET ONE

router.get(
    "/:id",
    getCustomerById
);


// CREATE

router.post(
    "/",
    createCustomer
);


// UPDATE

router.put(
    "/:id",
    updateCustomer
);


// DELETE

router.delete(
    "/:id",
    deleteCustomer
);


module.exports = router;
