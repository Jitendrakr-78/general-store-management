const db = require("../config/db");


// ========================================
// GET ALL CUSTOMERS
// ========================================

const getCustomers = async (req, res) => {

    try {

        const [customers] = await db.query(`
            SELECT
                id,
                name,
                phone,
                email,
                address,
                city,
                opening_balance,
                created_at

            FROM gs_customers

            ORDER BY id DESC
        `);


        res.json({

            success: true,

            data: customers

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch customers"

        });

    }

};


// ========================================
// GET SINGLE CUSTOMER
// ========================================

const getCustomerById = async (req, res) => {

    try {

        const { id } = req.params;


        const [customers] = await db.query(
            `
            SELECT
                id,
                name,
                phone,
                email,
                address,
                city,
                opening_balance

            FROM gs_customers

            WHERE id = ?
            `,
            [id]
        );


        if (customers.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        res.json({

            success: true,

            data: customers[0]

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch customer"

        });

    }

};


// ========================================
// CREATE CUSTOMER
// ========================================

const createCustomer = async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            address,
            city,
            opening_balance
        } = req.body;


        // Required field

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer name is required"

            });

        }


        const customerName =
            name.trim();


        // Convert opening balance

        const balance =
            Number(opening_balance) || 0;


        if (balance < 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Opening balance cannot be negative"

            });

        }


        // Insert

        const [result] = await db.query(
            `
            INSERT INTO gs_customers
            (
                name,
                phone,
                email,
                address,
                city,
                opening_balance
            )

            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                customerName,
                phone || null,
                email || null,
                address || null,
                city || null,
                balance
            ]
        );


        res.status(201).json({

            success: true,

            message:
                "Customer created successfully",

            customerId:
                result.insertId

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to create customer"

        });

    }

};


// ========================================
// UPDATE CUSTOMER
// ========================================

const updateCustomer = async (req, res) => {

    try {

        const { id } = req.params;


        const {
            name,
            phone,
            email,
            address,
            city,
            opening_balance
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer name is required"

            });

        }


        const balance =
            Number(opening_balance) || 0;


        if (balance < 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Opening balance cannot be negative"

            });

        }


        // Check customer

        const [existing] = await db.query(
            `
            SELECT id

            FROM gs_customers

            WHERE id = ?
            `,
            [id]
        );


        if (existing.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        // Update

        await db.query(
            `
            UPDATE gs_customers

            SET

                name = ?,

                phone = ?,

                email = ?,

                address = ?,

                city = ?,

                opening_balance = ?

            WHERE id = ?
            `,
            [
                name.trim(),
                phone || null,
                email || null,
                address || null,
                city || null,
                balance,
                id
            ]
        );


        res.json({

            success: true,

            message:
                "Customer updated successfully"

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to update customer"

        });

    }

};


// ========================================
// DELETE CUSTOMER
// ========================================

const deleteCustomer = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] = await db.query(
            `
            DELETE FROM gs_customers

            WHERE id = ?
            `,
            [id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        res.json({

            success: true,

            message:
                "Customer deleted successfully"

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to delete customer"

        });

    }

};


module.exports = {

    getCustomers,

    getCustomerById,

    createCustomer,

    updateCustomer,

    deleteCustomer

};
