<<<<<<< HEAD
const express = require("express");

const router = express.Router();


const {
    createPurchase,
    getPurchases,
    getPurchaseById
} = require(
    "../controllers/purchaseController"
);


// CREATE PURCHASE

router.post(
    "/",
    createPurchase
);


// GET ALL PURCHASES

router.get(
    "/",
    getPurchases
);


// GET PURCHASE DETAILS

router.get(
    "/:id",
    getPurchaseById
);


module.exports = router;
=======
const express = require("express");

const router = express.Router();


const {
    createPurchase,
    getPurchases,
    getPurchaseById
} = require(
    "../controllers/purchaseController"
);


// CREATE PURCHASE

router.post(
    "/",
    createPurchase
);


// GET ALL PURCHASES

router.get(
    "/",
    getPurchases
);


// GET PURCHASE DETAILS

router.get(
    "/:id",
    getPurchaseById
);


module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
