const express = require("express"); 
const router = express.Router(); 
const { 
    getInventory, adjustStock, 
    getStockMovements 
} = require("../controllers/inventoryController"); 

// Inventory 
// 
router.get( "/", getInventory ); 

// Stock adjustment 
// 
router.post( "/adjust", adjustStock ); 

// Stock movement history 
// 
router.get( "/movements", getStockMovements ); module.exports = router;