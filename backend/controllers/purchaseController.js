const db = require("../config/db"); 

// ======================================== 
// CREATE PURCHASE 
// ======================================== 
const createPurchase = async (req, res) => { 
    const connection = await db.getConnection(); 
    try { 
        const 
        { supplier_id, purchase_date, 
            discount, paid_amount, 
            payment_method, items 
        } = req.body; 
        if (!items || !Array.isArray(items) || items.length === 0) 
            { 
                return res.status(400).json({ 
                    success: false, 
                    message: "Purchase items are required" 
                }); 
            } await connection.beginTransaction(); 
            let subtotal = 0; 
            for (const item of items) 
                { 
                    const quantity = Number(item.quantity); 
                    const price = Number(item.purchase_price); 
                    if ( !item.product_id || quantity <= 0 || price < 0 ) 
                        { 
                            throw new Error( "Invalid product, quantity or purchase price" ); 
                        } 
                        subtotal += quantity * price; 
                    } const discountAmount = Number(discount || 0); 
                    const grandTotal = subtotal - discountAmount; 
                    const paid = Number(paid_amount || 0); 
                    const due = grandTotal - paid; 
                    const invoice_number = "PUR-" + Date.now(); 
                    const [purchaseResult] = await connection.query(` 
                        INSERT INTO gs_purchases ( 
                            invoice_number, supplier_id, 
                            purchase_date, subtotal, 
                            discount, grand_total, 
                            paid_amount, due_amount, 
                            payment_method 
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `,
                         [ invoice_number, supplier_id || null, 
                            purchase_date, subtotal, discountAmount, 
                            grandTotal, paid, due, 
                            payment_method || "CASH" ]); 
                            const purchaseId = purchaseResult.insertId; 
                            for (const item of items) { 
                                const productId = item.product_id; 
                                const quantity = Number(item.quantity); 
                                const price = Number(item.purchase_price); 
                                const total = quantity * price; 
                                const [products] = await connection.query(` 
                                    SELECT id, stock_quantity 
                                    FROM gs_products 
                                    WHERE id = ? 
                                    FOR UPDATE `, [productId]); 
                                    if (products.length === 0) {
                                         throw new Error( `Product ${productId} not found` ); 
                                        } 
                                        const previousStock = Number(products[0].stock_quantity || 0); 
                                        const newStock = previousStock + quantity; 
                                        await connection.query(` 
                                            INSERT INTO gs_purchase_items 
                                            ( 
                                                purchase_id, product_id, 
                                                quantity, purchase_price, 
                                                total 
                                            ) VALUES (?, ?, ?, ?, ?) `, 
                                            [ purchaseId, productId, 
                                                quantity, price, 
                                                total ]); 
                                                await connection.query(` 
                                                    UPDATE gs_products 
                                                    SET stock_quantity = ?, 
                                                    purchase_price = ? 
                                                    WHERE id = ? `, 
                                                    [ newStock, price, productId ]); 
                                                    await connection.query(` 
                                                        INSERT INTO gs_stock_movements 
                                                        ( 
                                                            product_id, movement_type, 
                                                            quantity, previous_stock, 
                                                            new_stock, reference_type, 
                                                            reference_id, remarks 
                                                        ) VALUES (?, 'IN', ?, ?, ?, ?, ?, ?) `, 
                                                        [ productId, quantity, 
                                                            previousStock, newStock, 
                                                            "PURCHASE", purchaseId, 
                                                            `Purchase ${invoice_number}` ]); 
                                                        } await connection.commit(); 
                                                        res.status(201).json({ 
                                                            success: true, 
                                                            message: "Purchase created successfully", 
                                                            data: { purchaseId, invoice_number, 
                                                                subtotal, discount: discountAmount, 
                                                                grandTotal, paidAmount: paid, 
                                                                dueAmount: due } 
                                                            }); 
                                                        } catch (error) { 
                                                            await connection.rollback(); 
                                                            console.error( "Create purchase error:", error ); 
                                                            res.status(400).json({ 
                                                                success: false, 
                                                                message: error.message 
                                                            }); 
                                                        } finally { connection.release(); 

                                                        } 
                                                    }; 
                                                    
                                                    // ======================================== 
                                                    // GET ALL PURCHASES 
                                                    // ======================================== 
                                                    // 
                                                    const getPurchases = async (req, res) => { 
                                                        try { 
                                                            const [purchases] = await db.query(` 
                                                                SELECT p.id, p.invoice_number, 
                                                                p.supplier_id, s.name AS supplier_name, 
                                                                p.purchase_date, p.subtotal, 
                                                                p.discount, p.grand_total, 
                                                                p.paid_amount, p.due_amount, 
                                                                p.payment_method 
                                                                FROM gs_purchases p LEFT JOIN gs_suppliers s ON p.supplier_id = s.id 
                                                                ORDER BY p.id DESC `); 
                                                                res.json({ 
                                                                    success: true, 
                                                                    purchases }); 
                                                                } 
                                                                catch (error) { 
                                                                    console.error( "Get purchases error:", error ); 
                                                                    res.status(500).json({ 
                                                                        success: false, 
                                                                        message: "Failed to load purchases" 
                                                                    }); 
                                                                } 
                                                            }; 
                                                            
                                                            // ======================================== 
                                                            //  GET PURCHASE BY ID 
                                                            // ======================================== 
                                                            // 
                                                            const getPurchaseById = async (req, res) => { 
                                                                try { const purchaseId = req.params.id; 
                                                                    const [purchases] = await db.query(` 
                                                                        SELECT p.id, p.invoice_number, 
                                                                        p.supplier_id, s.name AS supplier_name, 
                                                                        p.purchase_date, p.subtotal, 
                                                                        p.discount, p.grand_total, 
                                                                        p.paid_amount, p.due_amount, 
                                                                        p.payment_method 
                                                                        FROM gs_purchases p LEFT JOIN gs_suppliers s ON p.supplier_id = s.id 
                                                                        WHERE p.id = ? `, [purchaseId]); 
                                                                        if (purchases.length === 0) { 
                                                                            return res.status(404).json({ 
                                                                                success: false, 
                                                                                message: "Purchase not found" 
                                                                            }); 
                                                                        } 
                                                                        const [items] = await db.query(` 
                                                                            SELECT pi.id, pi.product_id, 
                                                                            pr.name AS product_name, 
                                                                            pi.quantity, pi.purchase_price, 
                                                                            pi.total 
                                                                            FROM gs_purchase_items pi LEFT JOIN gs_products pr 
                                                                            ON pi.product_id = pr.id 
                                                                            WHERE pi.purchase_id = ? 
                                                                            ORDER BY pi.id ASC `, 
                                                                            [purchaseId]); 
                                                                            res.json({ 
                                                                                success: true, 
                                                                                data: { ...purchases[0], items } 
                                                                            }); 
                                                                        } catch (error) { 
                                                                            console.error( "Get purchase by ID error:", error ); 
                                                                            res.status(500).json({ 
                                                                                success: false, 
                                                                                message: "Failed to load purchase" 
                                                                            }); 
                                                                        } 
                                                                    }; 
                                                                    // ========================================
                                                                 // EXPORT CONTROLLERS 
                                                                 // ======================================== 
                                                                 // 
                                                                 module.exports = { createPurchase, getPurchases, getPurchaseById };