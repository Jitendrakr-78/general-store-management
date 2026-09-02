const db = require("../config/db");


// ========================================
// GET DASHBOARD SUMMARY
// ========================================

const getDashboardSummary = async (req, res) => {

    try {

        // --------------------------------
        // TOTAL PRODUCTS
        // --------------------------------

        const [productResult] =
            await db.query(`
                SELECT COUNT(*) AS total_products
                FROM gs_products
            `);


        // --------------------------------
        // TOTAL CUSTOMERS
        // --------------------------------

        const [customerResult] =
            await db.query(`
                SELECT COUNT(*) AS total_customers
                FROM gs_customers
            `);


        // --------------------------------
        // TOTAL SUPPLIERS
        // --------------------------------

        const [supplierResult] =
            await db.query(`
                SELECT COUNT(*) AS total_suppliers
                FROM gs_suppliers
            `);


        // --------------------------------
        // TOTAL STOCK
        // --------------------------------

        const [stockResult] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(stock_quantity),
                        0
                    ) AS total_stock
                FROM gs_products
            `);


        // --------------------------------
        // STOCK VALUE
        // --------------------------------

        const [stockValueResult] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(
                            stock_quantity *
                            purchase_price
                        ),
                        0
                    ) AS stock_value
                FROM gs_products
            `);


        // --------------------------------
        // LOW STOCK
        // --------------------------------

        const [lowStockResult] =
            await db.query(`
                SELECT COUNT(*) AS low_stock
                FROM gs_products
                WHERE stock_quantity <= minimum_stock
            `);


        // --------------------------------
        // TODAY SALES
        // --------------------------------

        const [todaySalesResult] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(grand_total),
                        0
                    ) AS today_sales,

                    COUNT(*) AS today_sale_count

                FROM gs_sales

                WHERE sale_date =
                    CURDATE()
            `);


        // --------------------------------
        // TODAY PURCHASES
        // --------------------------------

        const [todayPurchaseResult] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(grand_total),
                        0
                    ) AS today_purchases,

                    COUNT(*) AS today_purchase_count

                FROM gs_purchases

                WHERE purchase_date =
                    CURDATE()
            `);


        // --------------------------------
        // TOTAL DUE FROM CUSTOMERS
        // --------------------------------

        const [customerDueResult] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(due_amount),
                        0
                    ) AS customer_due

                FROM gs_sales
            `);


        // --------------------------------
        // TOTAL DUE TO SUPPLIERS
        // --------------------------------

        const [supplierDueResult] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(due_amount),
                        0
                    ) AS supplier_due

                FROM gs_purchases
            `);


        res.json({

            success: true,

            data: {

                totalProducts:
                    productResult[0]
                        .total_products,

                totalCustomers:
                    customerResult[0]
                        .total_customers,

                totalSuppliers:
                    supplierResult[0]
                        .total_suppliers,

                totalStock:
                    stockResult[0]
                        .total_stock,

                stockValue:
                    stockValueResult[0]
                        .stock_value,

                lowStock:
                    lowStockResult[0]
                        .low_stock,

                todaySales:
                    todaySalesResult[0]
                        .today_sales,

                todaySaleCount:
                    todaySalesResult[0]
                        .today_sale_count,

                todayPurchases:
                    todayPurchaseResult[0]
                        .today_purchases,

                todayPurchaseCount:
                    todayPurchaseResult[0]
                        .today_purchase_count,

                customerDue:
                    customerDueResult[0]
                        .customer_due,

                supplierDue:
                    supplierDueResult[0]
                        .supplier_due

            }

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard"

        });

    }

};


// ========================================
// RECENT SALES
// ========================================

const getRecentSales = async (req, res) => {

    try {

        const [sales] =
            await db.query(`
                SELECT

                    s.id,

                    s.invoice_no,

                    s.sale_date,

                    s.grand_total,

                    s.paid_amount,

                    s.due_amount,

                    COALESCE(
                        c.name,
                        'Walk-in Customer'
                    ) AS customer_name

                FROM gs_sales s

                LEFT JOIN gs_customers c
                    ON s.customer_id = c.id

                ORDER BY s.id DESC

                LIMIT 10
            `);


        res.json({

            success: true,

            data: sales

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to load recent sales"

        });

    }

};


// ========================================
// LOW STOCK PRODUCTS
// ========================================

const getLowStockProducts = async (
    req,
    res
) => {

    try {

        const [products] =
            await db.query(`
                SELECT

                    id,

                    name,

                    stock_quantity,

                    minimum_stock,

                    selling_price

                FROM gs_products

                WHERE stock_quantity <= minimum_stock

                ORDER BY stock_quantity ASC

                LIMIT 10
            `);


        res.json({

            success: true,

            data: products

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to load low stock products"

        });

    }

};


module.exports = {

    getDashboardSummary,

    getRecentSales,

    getLowStockProducts

};
