<<<<<<< HEAD
const express = require("express");

const router = express.Router();


const {

    getDashboardSummary,

    getRecentSales,

    getLowStockProducts

} = require(
    "../controllers/dashboardController"
);


// Dashboard summary

router.get(
    "/summary",
    getDashboardSummary
);


// Recent sales

router.get(
    "/recent-sales",
    getRecentSales
);


// Low stock

router.get(
    "/low-stock",
    getLowStockProducts
);


module.exports = router;
=======
const express = require("express");

const router = express.Router();


const {

    getDashboardSummary,

    getRecentSales,

    getLowStockProducts

} = require(
    "../controllers/dashboardController"
);


// Dashboard summary

router.get(
    "/summary",
    getDashboardSummary
);


// Recent sales

router.get(
    "/recent-sales",
    getRecentSales
);


// Low stock

router.get(
    "/low-stock",
    getLowStockProducts
);


module.exports = router;
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
