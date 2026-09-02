CREATE DATABASE IF NOT EXISTS general_store;

USE general_store;


-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- CATEGORIES
-- =========================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- PRODUCTS
-- =========================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    purchase_price DECIMAL(10,2) DEFAULT 0,
    selling_price DECIMAL(10,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    minimum_stock INT DEFAULT 5,
    unit VARCHAR(30) DEFAULT 'piece',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);


-- =========================================
-- SUPPLIERS
-- =========================================

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- CUSTOMERS
-- =========================================

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- PURCHASES
-- =========================================

CREATE TABLE purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    invoice_number VARCHAR(100) UNIQUE,
    total_amount DECIMAL(12,2) DEFAULT 0,
    purchase_date DATE NOT NULL,

    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id)
    ON DELETE SET NULL
);


-- =========================================
-- PURCHASE ITEMS
-- =========================================

CREATE TABLE purchase_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (purchase_id)
    REFERENCES purchases(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT
);


-- =========================================
-- SALES
-- =========================================

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    invoice_number VARCHAR(100) UNIQUE,
    total_amount DECIMAL(12,2) DEFAULT 0,
    payment_method ENUM(
        'cash',
        'card',
        'online',
        'credit'
    ) DEFAULT 'cash',
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE SET NULL
);


-- =========================================
-- SALE ITEMS
-- =========================================

CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (sale_id)
    REFERENCES sales(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT
);
