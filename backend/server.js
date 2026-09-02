const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();


const db = require("./config/db");

const productRoutes =
    require("./routes/productRoutes");

const categoryRoutes =
    require("./routes/categoryRoutes");

const supplierRoutes =
    require("./routes/supplierRoutes");

const customerRoutes =
    require("./routes/customerRoutes");

const purchaseRoutes =
    require("./routes/purchaseRoutes");

const saleRoutes =
    require("./routes/saleRoutes");

const dashboardRoutes =
    require("./routes/dashboardRoutes");

const inventoryRoutes =
    require("./routes/inventoryRoutes");


    const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

// Frontend folder serve
app.use(express.static(path.join(__dirname, "../frontend")));
// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "General Store Management API is running"

    });

});


// ========================================
// DATABASE TEST
// ========================================

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        res.json({

            success: true,

            message:
                "MySQL database connected successfully",

            data: rows

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Database connection failed",

            error:
                error.message

        });

    }

});

// ========================================
// PRODUCT ROUTES
// ========================================

app.use(
    "/api/products",
    productRoutes
);


// ========================================
// CATEGORY ROUTES
// ========================================

app.use(
    "/api/categories",
    categoryRoutes
);

// ========================================
// SUPPLIER ROUTES
// ========================================

app.use(
    "/api/suppliers",
    supplierRoutes
);


// ========================================
// CUSTOMER ROUTES
// ========================================

app.use(
    "/api/customers",
    customerRoutes
);

// ========================================
// PURCHASE ROUTES
// ========================================

app.use(
    "/api/purchases",
    purchaseRoutes
);

// ========================================
// SALE ROUTES
// ========================================
app.use(
    "/api/sales",
    saleRoutes
);

// ========================================
// DASHBOARD ROUTES
// ========================================
app.use(
    "/api/dashboard",
    dashboardRoutes
);

// ========================================
// INVENTORY ROUTES
// ========================================
app.use(
    "/api/inventory",
    inventoryRoutes
);



// ========================================
// SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
