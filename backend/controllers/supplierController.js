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
                company_name,
                phone,
                email,
                address,
                city,
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

            message:
                "Failed to fetch suppliers"

        });

    }

};


// ========================================
// GET SINGLE SUPPLIER
// ========================================

const getSupplierById = async (req, res) => {

    try {

        const { id } = req.params;


        const [suppliers] = await db.query(
            `
            SELECT
                id,
                name,
                company_name,
                phone,
                email,
                address,
                city

            FROM gs_suppliers

            WHERE id = ?
            `,
            [id]
        );


        if (suppliers.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

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

            message:
                "Failed to fetch supplier"

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
            company_name,
            phone,
            email,
            address,
            city
        } = req.body;


        // Validation

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Supplier name is required"

            });

        }


        const supplierName =
            name.trim();


        // Check duplicate supplier

        const [existing] = await db.query(
            `
            SELECT id

            FROM gs_suppliers

            WHERE name = ?

            AND company_name = ?
            `,
            [
                supplierName,
                company_name || ""
            ]
        );


        if (existing.length > 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Supplier already exists"

            });

        }


        // Insert supplier

        const [result] = await db.query(
            `
            INSERT INTO gs_suppliers
            (
                name,
                company_name,
                phone,
                email,
                address,
                city
            )

            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                supplierName,
                company_name || null,
                phone || null,
                email || null,
                address || null,
                city || null
            ]
        );


        res.status(201).json({

            success: true,

            message:
                "Supplier created successfully",

            supplierId:
                result.insertId

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to create supplier"

        });

    }

};


// ========================================
// UPDATE SUPPLIER
// ========================================

const updateSupplier = async (req, res) => {

    try {

        const { id } = req.params;


        const {
            name,
            company_name,
            phone,
            email,
            address,
            city
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Supplier name is required"

            });

        }


        // Check supplier

        const [existing] = await db.query(
            `
            SELECT id

            FROM gs_suppliers

            WHERE id = ?
            `,
            [id]
        );


        if (existing.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        await db.query(
            `
            UPDATE gs_suppliers

            SET

                name = ?,

                company_name = ?,

                phone = ?,

                email = ?,

                address = ?,

                city = ?

            WHERE id = ?
            `,
            [
                name.trim(),
                company_name || null,
                phone || null,
                email || null,
                address || null,
                city || null,
                id
            ]
        );


        res.json({

            success: true,

            message:
                "Supplier updated successfully"

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to update supplier"

        });

    }

};


// ========================================
// DELETE SUPPLIER
// ========================================

const deleteSupplier = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] = await db.query(
            `
            DELETE FROM gs_suppliers

            WHERE id = ?
            `,
            [id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Supplier not found"

            });

        }


        res.json({

            success: true,

            message:
                "Supplier deleted successfully"

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to delete supplier"

        });

    }

};


module.exports = {

    getSuppliers,

    getSupplierById,

    createSupplier,

    updateSupplier,

    deleteSupplier

};
