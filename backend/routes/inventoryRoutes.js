<<<<<<< HEAD
const express = require("express");

const router = express.Router();


const {

    getInventory,

    adjustStock,

    getStockMovements

} = require(
    "../controllers/inventoryController"
);


// Inventory

router.get(
    "/",
    getInventory
);


// Stock adjustment

router.post(
    "/adjust",
    adjustStock
);


// Stock movement history

router.get(
    "/movements",
    getStockMovements
);


module.exports = router;
=======
const express = require("express");

const router = express.Router();


const {

    getInventory,

    adjustStock,

    getStockMovements

} = require(
    "../controllers/inventoryController"
);


// Inventory

router.get(
    "/",
    getInventory
);


// Stock adjustment

router.post(
    "/adjust",
    adjustStock
);


// Stock movement history

router.get(
    "/movements",
    getStockMovements
);


module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
