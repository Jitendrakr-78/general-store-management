const db = require("../config/db");

// ========================================
// GET ALL SUPPLIERS
// ========================================

const getSuppliers = async (req, res) => {
    try {
        const [suppliers] = await db.query(`
            SELECT
                id,
                name,
                phone,
                email,
                address,
                created_at
            FROM gs_suppliers
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            data: suppliers
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch suppliers"
        });
    }
};


// ========================================
// GET SUPPLIER BY ID
// ========================================

const getSupplierById = async (req, res) => {
    try {
        const [suppliers] = await db.query(
            `
            SELECT
                id,
                name,
                phone,
                email,
                address,
                created_at
            FROM gs_suppliers
            WHERE id = ?
            `,
            [req.params.id]
        );

        if (suppliers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.json({
            success: true,
            data: suppliers[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch supplier"
        });
    }
};


// ========================================
// CREATE SUPPLIER
// ========================================

const createSupplier = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            address
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Supplier name is required"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO gs_suppliers
            (name, phone, email, address)
            VALUES (?, ?, ?, ?)
            `,
            [
                name,
                phone || null,
                email || null,
                address || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: {
                id: result.insertId
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create supplier"
        });
    }
};


// ========================================
// UPDATE SUPPLIER
// ========================================

const updateSupplier = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            address
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Supplier name is required"
            });
        }

        const [result] = await db.query(
            `
            UPDATE gs_suppliers
            SET
                name = ?,
                phone = ?,
                email = ?,
                address = ?
            WHERE id = ?
            `,
            [
                name,
                phone || null,
                email || null,
                address || null,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.json({
            success: true,
            message: "Supplier updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update supplier"
        });
    }
};


// ========================================
// DELETE SUPPLIER
// ========================================

const deleteSupplier = async (req, res) => {
    try {
        const [result] = await db.query(
            `
            DELETE FROM gs_suppliers
            WHERE id = ?
            `,
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.json({
            success: true,
            message: "Supplier deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete supplier"
        });
    }
};


// ========================================
// EXPORTS
// ========================================

module.exports = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};