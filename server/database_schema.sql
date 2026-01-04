-- ============================================
-- JMC E-commerce Database Schema
-- Database: jmc_ecommerce
-- ============================================

-- NOTE: These tables are AUTOMATICALLY created by Sequelize
-- when you start the Node.js server (npm run dev)
-- You don't need to run this file manually!
-- 
-- However, if you want to create tables manually, you can use this SQL.

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255),
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `addresses` JSON,
  `wishlist` JSON,
  `cart` JSON,
  `isVerified` TINYINT(1) DEFAULT 0,
  `verificationToken` VARCHAR(255),
  `resetPasswordToken` VARCHAR(255),
  `resetPasswordExpire` DATETIME,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `comparePrice` DECIMAL(10,2),
  `stock` INT DEFAULT 0,
  `images` JSON,
  `video` VARCHAR(500),
  `variants` JSON,
  `category` ENUM('facewash', 'cream', 'tint', 'serum', 'other') DEFAULT 'other',
  `tags` JSON,
  `featured` TINYINT(1) DEFAULT 0,
  `averageRating` DECIMAL(2,1) DEFAULT 0.0,
  `numReviews` INT DEFAULT 0,
  `ingredients` JSON,
  `howToUse` TEXT,
  `benefits` JSON,
  `seoTitle` VARCHAR(255),
  `seoDescription` TEXT,
  `seoKeywords` JSON,
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_category` (`category`),
  INDEX `idx_featured` (`featured`),
  FULLTEXT INDEX `idx_search` (`name`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderNumber` VARCHAR(50) NOT NULL UNIQUE,
  `userId` INT,
  `customer` JSON NOT NULL,
  `items` JSON NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discount` DECIMAL(10,2) DEFAULT 0.00,
  `shippingCost` DECIMAL(10,2) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `couponCode` VARCHAR(50),
  `paymentMethod` ENUM('razorpay', 'cashfree', 'cod', 'mock') NOT NULL,
  `paymentId` VARCHAR(255),
  `paymentStatus` ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `shippingDetails` JSON,
  `trackingNumber` VARCHAR(255),
  `notes` TEXT,
  `statusHistory` JSON,
  `emailSent` TINYINT(1) DEFAULT 0,
  `whatsappSent` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_orderNumber` (`orderNumber`),
  INDEX `idx_userId` (`userId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_paymentStatus` (`paymentStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `userId` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `title` VARCHAR(255) NOT NULL,
  `comment` TEXT NOT NULL,
  `images` JSON,
  `helpful` INT DEFAULT 0,
  `verified` TINYINT(1) DEFAULT 0,
  `isApproved` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE INDEX `idx_product_user` (`productId`, `userId`),
  INDEX `idx_productId` (`productId`),
  INDEX `idx_userId` (`userId`),
  INDEX `idx_isApproved` (`isApproved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA INSERTION (Optional)
-- ============================================

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' (bcrypt)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) 
VALUES (
  'Admin',
  'admin@jmcskincare.com',
  '$2a$10$rQZ8YvZ3Q7XxJ.kqKx.5K.5wZ8YvZ3Q7XxJ.kqKx.5K.5wZ8YvZ3Q7', -- This is a placeholder, actual hash generated on server
  'admin',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE `email`=`email`;

-- Insert sample products
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `comparePrice`, `stock`, `category`, `featured`, `isActive`, `images`, `variants`, `createdAt`, `updatedAt`)
VALUES
  (
    'Lemon Facewash',
    'lemon-facewash',
    'Refreshing lemon facewash for deep cleansing and brightening. Perfect for daily use.',
    299.00,
    399.00,
    50,
    'facewash',
    1,
    1,
    JSON_ARRAY('https://via.placeholder.com/400x500?text=Lemon+Facewash'),
    JSON_ARRAY(
      JSON_OBJECT('name', '100ml', 'price', 299, 'stock', 30),
      JSON_OBJECT('name', '200ml', 'price', 499, 'stock', 20)
    ),
    NOW(),
    NOW()
  ),
  (
    'Centella Reversa Night Cream',
    'centella-reversa-night-cream',
    'Advanced night cream with Centella Asiatica for skin repair and rejuvenation.',
    599.00,
    799.00,
    25,
    'cream',
    1,
    1,
    JSON_ARRAY('https://via.placeholder.com/400x500?text=Night+Cream'),
    JSON_ARRAY(
      JSON_OBJECT('name', '50ml', 'price', 599, 'stock', 25)
    ),
    NOW(),
    NOW()
  ),
  (
    'JMC Skin Tint with SPF',
    'jmc-skin-tint-spf',
    'Lightweight skin tint with SPF 30 for natural coverage and sun protection.',
    899.00,
    1199.00,
    15,
    'tint',
    1,
    1,
    JSON_ARRAY('https://via.placeholder.com/400x500?text=Skin+Tint'),
    JSON_ARRAY(
      JSON_OBJECT('name', 'Light', 'price', 899, 'stock', 5),
      JSON_OBJECT('name', 'Medium', 'price', 899, 'stock', 5),
      JSON_OBJECT('name', 'Dark', 'price', 899, 'stock', 5)
    ),
    NOW(),
    NOW()
  )
ON DUPLICATE KEY UPDATE `slug`=`slug`;

-- ============================================
-- USEFUL QUERIES FOR TESTING
-- ============================================

-- View all tables
-- SHOW TABLES;

-- View table structure
-- DESCRIBE users;
-- DESCRIBE products;
-- DESCRIBE orders;
-- DESCRIBE reviews;

-- Count records in each table
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'products', COUNT(*) FROM products
-- UNION ALL
-- SELECT 'orders', COUNT(*) FROM orders
-- UNION ALL
-- SELECT 'reviews', COUNT(*) FROM reviews;

-- View all products
-- SELECT id, name, price, stock, featured, isActive FROM products;

-- View recent orders
-- SELECT orderNumber, JSON_EXTRACT(customer, '$.name') as customer_name, 
--        total, status, createdAt 
-- FROM orders 
-- ORDER BY createdAt DESC 
-- LIMIT 10;

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Reset database (USE WITH CAUTION!)
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS users;

-- Backup database
-- mysqldump -u root jmc_ecommerce > backup_$(date +%Y%m%d).sql

-- ============================================
-- NOTES
-- ============================================

-- 1. AUTOMATIC TABLE CREATION:
--    When you run 'npm run dev' in the server folder,
--    Sequelize automatically creates these tables based on
--    the models defined in server/models/*.js
--
-- 2. JSON COLUMNS:
--    We use JSON columns for flexible data like addresses,
--    cart items, variants, etc. MySQL 5.7+ supports JSON.
--
-- 3. INDEXES:
--    Indexes are created for frequently queried columns
--    to improve query performance.
--
-- 4. CHARACTER SET:
--    utf8mb4 supports emoji and international characters.
--
-- 5. ENGINE:
--    InnoDB supports foreign keys and transactions.

-- ============================================
-- DATABASE CREATED SUCCESSFULLY!
-- Run this in phpMyAdmin or MySQL command line
-- ============================================
