const express = require("express"); 
const router = express.Router(); 
const { 
    getCustomers, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
} = require("../controllers/customerController"); 

// GET ALL CUSTOMERS 
router.get( "/", getCustomers ); 

// GET SINGLE CUSTOMER 
router.get( "/:id", getCustomerById ); 

// CREATE CUSTOMER 
router.post( "/", createCustomer ); 

// UPDATE CUSTOMER 
router.put( "/:id", updateCustomer ); 

// DELETE CUSTOMER 
router.delete( "/:id", deleteCustomer ); 
module.exports = router;