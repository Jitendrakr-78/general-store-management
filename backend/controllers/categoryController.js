const db = require("../config/db"); 
// ======================================== 
// GET ALL CATEGORIES 
// ======================================== 
const getCategories = async (req, res) => 
    { try 
        { 
            const [categories] = await db.query(` 
                SELECT id, 
                name, 
                description, 
                created_at 
                FROM gs_categories ORDER BY id DESC 
                `);

                res.json({ 
                    success: true, 
                    data: categories 
                }); 
            } catch (error) { 
                console.error(error); 
                res.status(500).json({ 
                    success: false, 
                    message: "Failed to fetch categories" });
                 } 
                }; 
                // ======================================== 
                // GET SINGLE CATEGORY 
                // ======================================== 
                const getCategoryById = async (req, res) => {
                     try { 
                        const { id } = req.params;
                        const [categories] = await db.query(` 
                            SELECT id, 
                            name, 
                            description 
                            FROM gs_categories 
                            WHERE id = ? 
                            `, [id]);

                            if (categories.length === 0) { 
                                return res.status(404).json({ 
                                    success: false, 
                                    message: "Category not found" 
                                }); 
                            } res.json({ 
                                success: true, 
                                data: categories[0] 
                            }); 
                        } catch (error) { 
                            console.error(error);
                            
                            res.status(500).json({ 
                                success: false, 
                                message: "Failed to fetch category" 
                            }); 
                        } 
                    }; 
                    // ========================================
                 // CREATE CATEGORY
                  // ======================================== 
                  const createCategory = async (req, res) => { 
                    try { 
                        const { name, description } = req.body;
                         if (!name || !name.trim()) 
                            { 
                                return res.status(400).json({ 
                                    success: false, 
                                    message: "Category name is required" 
                                }); 
                            } 
                            const categoryName = name.trim(); 
                            const [existing] = await db.query(` 
                                SELECT id 
                                FROM gs_categories 
                                WHERE name = ? `, 
                                [categoryName]); 
                                
                                if (existing.length > 0) 
                                    { 
                                        return res.status(400).json({ 
                                            success: false, 
                                            message: "Category already exists" 
                                        }); 
                                    } 
                                    const [result] = await db.query(` 
                                        INSERT INTO gs_categories ( 
                                            name, 
                                            description ) 
                                            VALUES (?, ?) `, 
                                            [ 
                                                categoryName, 
                                                description || null 
                                            ]); 
                                            res.status(201).json({ 
                                                success: true, 
                                                message: "Category created successfully", 
                                                categoryId: result.insertId 
                                            }); 
                                        } catch (error) { 
                                            console.error(error); 
                                            res.status(500).json({ 
                                                success: false, 
                                                message: "Failed to create category" 
                                            }); 
                                        } }; 
                                        // ======================================== 
                                        // UPDATE CATEGORY 
                                        // ======================================== 
                                        const updateCategory = async (req, res) => { 
                                            try { const { id } = req.params; 
                                            const { name, description } = req.body;
                                             if (!name || !name.trim()) 
                                                { 
                                                    return res.status(400).json({ 
                                                        success: false, 
                                                        message: "Category name is required" 
                                                    }); 
                                                } const [existing] = await db.query(` 
                                                    SELECT id 
                                                    FROM gs_categories 
                                                    WHERE id = ? `, [id]); 
                                                    if (existing.length === 0) 
                                                        { 
                                                            return res.status(404).json({ 
                                                                success: false, 
                                                                message: "Category not found" 
                                                            }); 
                                                        } 
                                                        
                                                        const categoryName = name.trim(); 
                                                        const [duplicate] = await db.query(` 
                                                            SELECT id 
                                                            FROM gs_categories 
                                                            WHERE name = ? AND id != ? `, 
                                                            [ categoryName, id ]); 
                                                            if (duplicate.length > 0) 
                                                                { 
                                                                    return res.status(400).json({ 
                                                                        success: false, 
                                                                        message: "Another category with this name already exists" }); 
                                                                    } 
                                                                    await db.query(` 
                                                                        UPDATE gs_categories SET name = ?, 
                                                                        description = ? WHERE id = ? `, 
                                                                        [ 
                                                                            categoryName, 
                                                                            description || null, id ]); 
                                                                            res.json({ 
                                                                                success: true, 
                                                                                message: "Category updated successfully" 
                                                                            }); 
                                                                        } 
                                                                        catch (error) { 
                                                                            console.error(error); 
                                                                            res.status(500).json({ 
                                                                                success: false, 
                                                                                message: "Failed to update category" 
                                                                            }); 
                                                                        } }; 
                                                                        // ======================================== 
                                                                        // DELETE CATEGORY 
                                                                        // ======================================== 
                                                                        const deleteCategory = async (req, res) => { 
                                                                            try { 
                                                                                const { id } = req.params; 
                                                                                const [products] = await db.query(` 
                                                                                    SELECT COUNT(*) AS total FROM gs_products 
                                                                                    WHERE category_id = ? `, [id]); 
                                                                                    if (products[0].total > 0) 
                                                                                        { 
                                                                                            return res.status(400).json({ 
                                                                                                success: false, 
                                                                                                message: "Cannot delete this category because products are using it" 
                                                                                            }); 
                                                                                        } 
                                                                                        const [result] = await db.query(` 
                                                                                            DELETE FROM gs_categories WHERE id = ? `, [id]); 
                                                                                            if (result.affectedRows === 0) 
                                                                                                { 
                                                                                                    return res.status(404).json({ 
                                                                                                        success: false, 
                                                                                                        message: "Category not found" 
                                                                                                    }); 
                                                                                                } 
                                                                                                res.json({ 
                                                                                                    success: true, 
                                                                                                    message: "Category deleted successfully" 
                                                                                                }); 
                                                                                            } 
                                                                                            catch (error) { 
                                                                                                console.error(error); 
                                                                                                res.status(500).json({ 
                                                                                                    success: false, 
                                                                                                    message: "Failed to delete category" 
                                                                                                });
                                                                                             } 
                                                                                            }; 
                                                                                            // ======================================== 
                                                                                            // EXPORTS 
                                                                                            // ======================================== 
                                                                                            module.exports = { 
                                                                                                getCategories, 
                                                                                                getCategoryById, 
                                                                                                createCategory, 
                                                                                                updateCategory, 
                                                                                                deleteCategory 
                                                                                            };