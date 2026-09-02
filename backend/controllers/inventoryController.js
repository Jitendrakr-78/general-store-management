<<<<<<< HEAD
const db = require("../config/db");


// ========================================
// GET INVENTORY
// ========================================

const getInventory = async (req, res) => {

    try {

        const [products] = await db.query(`

            SELECT

                p.id,

                p.name,

                p.purchase_price,

                p.selling_price,

                p.stock_quantity,

                p.minimum_stock,

                c.name AS category_name,

                (
                    p.stock_quantity *
                    p.purchase_price
                ) AS stock_value,

                CASE

                    WHEN p.stock_quantity <= 0
                        THEN 'OUT OF STOCK'

                    WHEN p.stock_quantity <=
                         p.minimum_stock
                        THEN 'LOW STOCK'

                    ELSE 'IN STOCK'

                END AS stock_status

            FROM gs_products p

            LEFT JOIN gs_categories c
                ON p.category_id = c.id

            ORDER BY p.name ASC

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
                "Failed to load inventory"

        });

    }

};


// ========================================
// STOCK ADJUSTMENT
// ========================================

const adjustStock = async (req, res) => {

    const connection =
        await db.getConnection();


    try {

        const {

            product_id,
            quantity,
            adjustment_type,
            remarks

        } = req.body;


        if (
            !product_id ||
            quantity === undefined ||
            !adjustment_type
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing"

            });

        }


        const adjustmentQuantity =
            Number(quantity);


        if (
            isNaN(adjustmentQuantity) ||
            adjustmentQuantity <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be greater than zero"

            });

        }


        await connection.beginTransaction();


        // --------------------------------
        // GET PRODUCT
        // --------------------------------

        const [products] =
            await connection.query(`

                SELECT
                    id,
                    stock_quantity

                FROM gs_products

                WHERE id = ?

                FOR UPDATE

            `, [product_id]);


        if (products.length === 0) {

            throw new Error(
                "Product not found"
            );

        }


        const previousStock =
            Number(
                products[0].stock_quantity
            );


        let newStock;


        // --------------------------------
        // STOCK IN
        // --------------------------------

        if (
            adjustment_type === "IN"
        ) {

            newStock =
                previousStock +
                adjustmentQuantity;

        }


        // --------------------------------
        // STOCK OUT
        // --------------------------------

        else if (
            adjustment_type === "OUT"
        ) {

            newStock =
                previousStock -
                adjustmentQuantity;


            if (newStock < 0) {

                throw new Error(
                    "Insufficient stock"
                );

            }

        }


        // --------------------------------
        // DIRECT ADJUSTMENT
        // --------------------------------

        else if (
            adjustment_type === "ADJUSTMENT"
        ) {

            newStock =
                adjustmentQuantity;

        }


        else {

            throw new Error(
                "Invalid adjustment type"
            );

        }


        // --------------------------------
        // UPDATE PRODUCT STOCK
        // --------------------------------

        await connection.query(`

            UPDATE gs_products

            SET stock_quantity = ?

            WHERE id = ?

        `, [
            newStock,
            product_id
        ]);


        // --------------------------------
        // INSERT MOVEMENT
        // --------------------------------

        await connection.query(`

            INSERT INTO gs_stock_movements (

                product_id,

                movement_type,

                quantity,

                previous_stock,

                new_stock,

                reference_type,

                remarks

            )

            VALUES (?, ?, ?, ?, ?, ?, ?)

        `, [

            product_id,

            adjustment_type,

            adjustmentQuantity,

            previousStock,

            newStock,

            "MANUAL",

            remarks || null

        ]);


        await connection.commit();


        res.json({

            success: true,

            message:
                "Stock updated successfully",

            data: {

                previousStock,

                newStock

            }

        });


    } catch (error) {

        await connection.rollback();

        console.error(error);


        res.status(400).json({

            success: false,

            message: error.message

        });

    } finally {

        connection.release();

    }

};


// ========================================
// STOCK MOVEMENT HISTORY
// ========================================

const getStockMovements = async (
    req,
    res
) => {

    try {

        const [movements] =
            await db.query(`

                SELECT

                    sm.id,

                    sm.movement_type,

                    sm.quantity,

                    sm.previous_stock,

                    sm.new_stock,

                    sm.reference_type,

                    sm.reference_id,

                    sm.remarks,

                    sm.movement_date,

                    p.name AS product_name

                FROM gs_stock_movements sm

                INNER JOIN gs_products p

                    ON sm.product_id =
                       p.id

                ORDER BY
                    sm.id DESC

                LIMIT 100

            `);


        res.json({

            success: true,

            data: movements

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to load stock movements"

        });

    }

};


module.exports = {

    getInventory,

    adjustStock,

    getStockMovements

};
=======
const db = require("../config/db");


// ========================================
// GET INVENTORY
// ========================================

const getInventory = async (req, res) => {

    try {

        const [products] = await db.query(`

            SELECT

                p.id,

                p.name,

                p.purchase_price,

                p.selling_price,

                p.stock_quantity,

                p.minimum_stock,

                c.name AS category_name,

                (
                    p.stock_quantity *
                    p.purchase_price
                ) AS stock_value,

                CASE

                    WHEN p.stock_quantity <= 0
                        THEN 'OUT OF STOCK'

                    WHEN p.stock_quantity <=
                         p.minimum_stock
                        THEN 'LOW STOCK'

                    ELSE 'IN STOCK'

                END AS stock_status

            FROM gs_products p

            LEFT JOIN gs_categories c
                ON p.category_id = c.id

            ORDER BY p.name ASC

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
                "Failed to load inventory"

        });

    }

};


// ========================================
// STOCK ADJUSTMENT
// ========================================

const adjustStock = async (req, res) => {

    const connection =
        await db.getConnection();


    try {

        const {

            product_id,
            quantity,
            adjustment_type,
            remarks

        } = req.body;


        if (
            !product_id ||
            quantity === undefined ||
            !adjustment_type
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing"

            });

        }


        const adjustmentQuantity =
            Number(quantity);


        if (
            isNaN(adjustmentQuantity) ||
            adjustmentQuantity <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be greater than zero"

            });

        }


        await connection.beginTransaction();


        // --------------------------------
        // GET PRODUCT
        // --------------------------------

        const [products] =
            await connection.query(`

                SELECT
                    id,
                    stock_quantity

                FROM gs_products

                WHERE id = ?

                FOR UPDATE

            `, [product_id]);


        if (products.length === 0) {

            throw new Error(
                "Product not found"
            );

        }


        const previousStock =
            Number(
                products[0].stock_quantity
            );


        let newStock;


        // --------------------------------
        // STOCK IN
        // --------------------------------

        if (
            adjustment_type === "IN"
        ) {

            newStock =
                previousStock +
                adjustmentQuantity;

        }


        // --------------------------------
        // STOCK OUT
        // --------------------------------

        else if (
            adjustment_type === "OUT"
        ) {

            newStock =
                previousStock -
                adjustmentQuantity;


            if (newStock < 0) {

                throw new Error(
                    "Insufficient stock"
                );

            }

        }


        // --------------------------------
        // DIRECT ADJUSTMENT
        // --------------------------------

        else if (
            adjustment_type === "ADJUSTMENT"
        ) {

            newStock =
                adjustmentQuantity;

        }


        else {

            throw new Error(
                "Invalid adjustment type"
            );

        }


        // --------------------------------
        // UPDATE PRODUCT STOCK
        // --------------------------------

        await connection.query(`

            UPDATE gs_products

            SET stock_quantity = ?

            WHERE id = ?

        `, [
            newStock,
            product_id
        ]);


        // --------------------------------
        // INSERT MOVEMENT
        // --------------------------------

        await connection.query(`

            INSERT INTO gs_stock_movements (

                product_id,

                movement_type,

                quantity,

                previous_stock,

                new_stock,

                reference_type,

                remarks

            )

            VALUES (?, ?, ?, ?, ?, ?, ?)

        `, [

            product_id,

            adjustment_type,

            adjustmentQuantity,

            previousStock,

            newStock,

            "MANUAL",

            remarks || null

        ]);


        await connection.commit();


        res.json({

            success: true,

            message:
                "Stock updated successfully",

            data: {

                previousStock,

                newStock

            }

        });


    } catch (error) {

        await connection.rollback();

        console.error(error);


        res.status(400).json({

            success: false,

            message: error.message

        });

    } finally {

        connection.release();

    }

};


// ========================================
// STOCK MOVEMENT HISTORY
// ========================================

const getStockMovements = async (
    req,
    res
) => {

    try {

        const [movements] =
            await db.query(`

                SELECT

                    sm.id,

                    sm.movement_type,

                    sm.quantity,

                    sm.previous_stock,

                    sm.new_stock,

                    sm.reference_type,

                    sm.reference_id,

                    sm.remarks,

                    sm.movement_date,

                    p.name AS product_name

                FROM gs_stock_movements sm

                INNER JOIN gs_products p

                    ON sm.product_id =
                       p.id

                ORDER BY
                    sm.id DESC

                LIMIT 100

            `);


        res.json({

            success: true,

            data: movements

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to load stock movements"

        });

    }

};


module.exports = {

    getInventory,

    adjustStock,

    getStockMovements

};
>>>>>>> a473e3435407118240ea630d7a70313ef8388e7c
