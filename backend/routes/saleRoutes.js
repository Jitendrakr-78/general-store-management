<<<<<<< HEAD
const express = require("express");

const router = express.Router();


const {

    createSale,

    getSales,

    getSaleById

} = require(
    "../controllers/saleController"
);


// CREATE SALE

router.post(
    "/",
    createSale
);


// GET ALL SALES

router.get(
    "/",
    getSales
);


// GET SALE DETAILS

router.get(
    "/:id",
    getSaleById
);


module.exports = router;
=======
const express = require("express");

const router = express.Router();


const {

    createSale,

    getSales,

    getSaleById

} = require(
    "../controllers/saleController"
);


// CREATE SALE

router.post(
    "/",
    createSale
);


// GET ALL SALES

router.get(
    "/",
    getSales
);


// GET SALE DETAILS

router.get(
    "/:id",
    getSaleById
);


module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
