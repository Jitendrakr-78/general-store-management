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
