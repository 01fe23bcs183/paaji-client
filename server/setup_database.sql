-- JMC Skincare E-commerce Database Setup
-- Run this in phpMyAdmin or MySQL Workbench

-- Create database
CREATE DATABASE IF NOT EXISTS jmc_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE jmc_ecommerce;

-- Grant permissions (if needed)
GRANT ALL PRIVILEGES ON jmc_ecommerce.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Database created successfully!
-- Now the Node.js backend will auto-create all tables using Sequelize
