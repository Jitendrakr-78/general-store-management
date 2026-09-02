const db = require("../config/db");


// ========================================
// CREATE SALE
// ========================================

const createSale = async (req, res) => {

    const connection = await db.getConnection();

    try {

        const {
            customer_id,
            sale_date,
            discount,
            paid_amount,
            payment_method,
            items
        } = req.body;


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (!sale_date) {

            return res.status(400).json({

                success: false,

                message: "Sale date is required"

            });

        }


        if (!Array.isArray(items) ||
            items.length === 0) {

            return res.status(400).json({

                success: false,

                message:
                    "At least one product is required"

            });

        }


        // --------------------------------
        // CALCULATE SUBTOTAL
        // --------------------------------

        let subtotal = 0;


        for (const item of items) {

            const quantity =
                Number(item.quantity);

            const sellingPrice =
                Number(item.selling_price);


            if (
                !item.product_id ||
                quantity <= 0 ||
                sellingPrice < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid sale item"

                });

            }


            subtotal +=
                quantity * sellingPrice;

        }


        const discountAmount =
            Number(discount) || 0;


        if (discountAmount < 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Discount cannot be negative"

            });

        }


        if (discountAmount > subtotal) {

            return res.status(400).json({

                success: false,

                message:
                    "Discount cannot exceed subtotal"

            });

        }


        const grandTotal =
            subtotal - discountAmount;


        const paid =
            Number(paid_amount) || 0;


        if (paid < 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Paid amount cannot be negative"

            });

        }


        if (paid > grandTotal) {

            return res.status(400).json({

                success: false,

                message:
                    "Paid amount cannot exceed grand total"

            });

        }


        const dueAmount =
            grandTotal - paid;


        // --------------------------------
        // START TRANSACTION
        // --------------------------------

        await connection.beginTransaction();


        // --------------------------------
        // GENERATE INVOICE NUMBER
        // --------------------------------

        const [lastSale] =
            await connection.query(
                `
                SELECT id
                FROM gs_sales
                ORDER BY id DESC
                LIMIT 1
                `
            );


        let nextId = 1;


        if (lastSale.length > 0) {

            nextId =
                lastSale[0].id + 1;

        }


        const invoiceNo =
            "SAL-" +
            String(nextId).padStart(
                4,
                "0"
            );


        // --------------------------------
        // INSERT SALE
        // --------------------------------

        const [saleResult] =
            await connection.query(
                `
                INSERT INTO gs_sales
                (
                    invoice_no,
                    customer_id,
                    sale_date,
                    subtotal,
                    discount,
                    grand_total,
                    paid_amount,
                    due_amount,
                    payment_method
                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    invoiceNo,

                    customer_id || null,

                    sale_date,

                    subtotal,

                    discountAmount,

                    grandTotal,

                    paid,

                    dueAmount,

                    payment_method || "Cash"
                ]
            );


        const saleId =
            saleResult.insertId;


        // --------------------------------
        // PROCESS ITEMS
        // --------------------------------

        for (const item of items) {

            const productId =
                Number(item.product_id);

            const quantity =
                Number(item.quantity);

            const sellingPrice =
                Number(item.selling_price);


            // Get product stock

            const [products] =
                await connection.query(
                    `
                    SELECT
                        id,
                        name,
                        stock_quantity

                    FROM gs_products

                    WHERE id = ?

                    FOR UPDATE
                    `,
                    [productId]
                );


            if (products.length === 0) {

                throw new Error(
                    `Product ${productId} not found`
                );

            }


            const product =
                products[0];


            const currentStock =
                Number(
                    product.stock_quantity
                ) || 0;


            // --------------------------------
            // CHECK STOCK
            // --------------------------------

            if (currentStock < quantity) {

                throw new Error(
                    `Insufficient stock for ${product.name}. Available stock: ${currentStock}`
                );

            }


            const itemTotal =
                quantity * sellingPrice;


            // --------------------------------
            // INSERT SALE ITEM
            // --------------------------------

            await connection.query(
                `
                INSERT INTO gs_sale_items
                (
                    sale_id,
                    product_id,
                    quantity,
                    selling_price,
                    total
                )

                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    saleId,

                    productId,

                    quantity,

                    sellingPrice,

                    itemTotal
                ]
            );


            // --------------------------------
            // DECREASE STOCK
            // --------------------------------

            await connection.query(
                `
                UPDATE gs_products

                SET stock_quantity =
                    stock_quantity - ?

                WHERE id = ?
                `,
                [
                    quantity,
                    productId
                ]
            );

        }


        // --------------------------------
        // COMMIT
        // --------------------------------

        await connection.commit();


        res.status(201).json({

            success: true,

            message:
                "Sale saved successfully",

            saleId,

            invoiceNo,

            subtotal,

            discount:
                discountAmount,

            grandTotal,

            paidAmount:
                paid,

            dueAmount,

            paymentMethod:
                payment_method || "Cash"

        });


    } catch (error) {

        await connection.rollback();

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to save sale"

        });


    } finally {

        connection.release();

    }

};


// ========================================
// GET ALL SALES
// ========================================

const getSales = async (req, res) => {

    try {

        const [sales] =
            await db.query(
                `
                SELECT

                    s.id,

                    s.invoice_no,

                    s.sale_date,

                    s.subtotal,

                    s.discount,

                    s.grand_total,

                    s.paid_amount,

                    s.due_amount,

                    s.payment_method,

                    COALESCE(
                        c.name,
                        'Walk-in Customer'
                    ) AS customer_name

                FROM gs_sales s

                LEFT JOIN customers c
                    ON s.customer_id = c.id

                ORDER BY s.id DESC
                `
            );


        res.json({

            success: true,

            data: sales

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch sales"

        });

    }

};


// ========================================
// GET SALE DETAILS
// ========================================

const getSaleById = async (req, res) => {

    try {

        const { id } =
            req.params;


        const [sale] =
            await db.query(
                `
                SELECT

                    s.id,

                    s.invoice_no,

                    s.sale_date,

                    s.subtotal,

                    s.discount,

                    s.grand_total,

                    s.paid_amount,

                    s.due_amount,

                    s.payment_method,

                    s.customer_id,

                    COALESCE(
                        c.name,
                        'Walk-in Customer'
                    ) AS customer_name

                FROM gs_sales s

                LEFT JOIN customers c
                    ON s.customer_id = c.id

                WHERE s.id = ?

                `,
                [id]
            );


        if (sale.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Sale not found"

            });

        }


        const [items] =
            await db.query(
                `
                SELECT

                    si.id,

                    si.product_id,

                    p.name AS product_name,

                    si.quantity,

                    si.selling_price,

                    si.total

                FROM gs_sale_items si

                INNER JOIN gs_products p
                    ON si.product_id = p.id

                WHERE si.sale_id = ?

                ORDER BY si.id

                `,
                [id]
            );


        res.json({

            success: true,

            data: {

                sale:
                    sale[0],

                items

            }

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch sale"

        });

    }

};


module.exports = {

    createSale,

    getSales,

    getSaleById

};
