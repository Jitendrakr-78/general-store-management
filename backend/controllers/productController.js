const db = require("../config/db");

// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT
                gs_products.id,
                gs_products.name,
                gs_products.category_id,
                gs_products.purchase_price,
                gs_products.selling_price,
                gs_products.stock_quantity,
                gs_products.minimum_stock,
                gs_categories.name AS category_name
            FROM gs_products
            LEFT JOIN gs_categories
                ON gs_products.category_id = gs_categories.id
            ORDER BY gs_products.id DESC
        `);

        res.json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};
// ========================================
// GET SINGLE PRODUCT
// ========================================

const getProductById = async (req, res) => {
try {
const { id } = req.params;

    const [products] = await db.query(
        `
        SELECT *
        FROM gs_products
        WHERE id = ?
        `,
        [id]
    );

    if (products.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        data: products[0]
    });
} catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Failed to fetch product"
    });
}

};

// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (req, res) => {
try {
const {
category_id,
name,
sku,
purchase_price,
selling_price,
stock_quantity,
minimum_stock,
unit
} = req.body;

    if (!name || !sku) {
        return res.status(400).json({
            success: false,
            message: "Product name and SKU are required"
        });
    }

    const [existing] = await db.query(
        `
        SELECT id
        FROM gs_products
        WHERE sku = ?
        `,
        [sku]
    );

    if (existing.length > 0) {
        return res.status(400).json({
            success: false,
            message: "SKU already exists"
        });
    }

    const [result] = await db.query(
        `
        INSERT INTO gs_products
        (
            category_id,
            name,
            sku,
            purchase_price,
            selling_price,
            stock_quantity,
            minimum_stock,
            unit
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            category_id || null,
            name,
            sku,
            purchase_price || 0,
            selling_price || 0,
            stock_quantity || 0,
            minimum_stock || 5,
            unit || "piece"
        ]
    );

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        productId: result.insertId
    });
} catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Failed to create product"
    });
}

};

// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {
try {
const { id } = req.params;

    const {
        category_id,
        name,
        sku,
        purchase_price,
        selling_price,
        stock_quantity,
        minimum_stock,
        unit
    } = req.body;

    if (!name || !sku) {
        return res.status(400).json({
            success: false,
            message: "Product name and SKU are required"
        });
    }

    const [existingProduct] = await db.query(
        `
        SELECT id
        FROM gs_products
        WHERE id = ?
        `,
        [id]
    );

    if (existingProduct.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await db.query(
        `
        UPDATE gs_products
        SET
            category_id = ?,
            name = ?,
            sku = ?,
            purchase_price = ?,
            selling_price = ?,
            stock_quantity = ?,
            minimum_stock = ?,
            unit = ?
        WHERE id = ?
        `,
        [
            category_id || null,
            name,
            sku,
            purchase_price || 0,
            selling_price || 0,
            stock_quantity || 0,
            minimum_stock || 5,
            unit || "piece",
            id
        ]
    );

    res.json({
        success: true,
        message: "Product updated successfully"
    });
} catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Failed to update product"
    });
}

};

// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {
try {
const { id } = req.params;

    const [result] = await db.query(
        `
        DELETE FROM gs_products
        WHERE id = ?
        `,
        [id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        message: "Product deleted successfully"
    });
} catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Failed to delete product"
    });
}

};

module.exports = {
getProducts,
getProductById,
createProduct,
updateProduct,
deleteProduct
};