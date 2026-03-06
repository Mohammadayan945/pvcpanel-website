-- ============================================
-- PVC CONTRACTOR WEBSITE - MySQL Schema
-- ============================================
-- Run this in MySQL Workbench or terminal:
-- mysql -u root -p pvc_contractor < schema.sql

-- Create and select database
CREATE DATABASE IF NOT EXISTS pvc_contractor;
USE pvc_contractor;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  service VARCHAR(100),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  ip_address VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- QUOTE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  service_type VARCHAR(100) NOT NULL,
  room_size VARCHAR(50),
  city VARCHAR(100),
  address TEXT,
  budget_range VARCHAR(50),
  timeline VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  assigned_to INT,
  quote_amount DECIMAL(10,2),
  notes TEXT,
  site_visit_date DATE,
  ip_address VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_filename VARCHAR(255) NOT NULL,
  is_featured TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  created_by INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  price_from DECIMAL(8,2),
  price_to DECIMAL(8,2),
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  rating INT DEFAULT 5,
  review TEXT NOT NULL,
  service_used VARCHAR(100),
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_quotes_status ON quote_requests(status);
CREATE INDEX idx_gallery_category ON gallery(category);

-- ============================================
-- SEED DATA - Default Services
-- ============================================
INSERT IGNORE INTO services (name, slug, description, icon, price_from, price_to, display_order) VALUES
('PVC Wall Panels',    'pvc-wall-panels',   'Waterproof, low-maintenance PVC panels in 50+ textures.', '🏠', 35.00, 90.00,  1),
('PVC Ceiling Panels', 'pvc-ceiling-panels','Elegant ceiling solutions that add a premium look.',       '✨', 40.00, 95.00,  2),
('WPC Flooring',       'wpc-flooring',      'Wood-polymer composite flooring with extreme durability.', '🏢', 60.00, 150.00, 3),
('3D Wall Panels',     '3d-wall-panels',    'Add depth and drama with stunning 3D patterns.',           '🎨', 80.00, 200.00, 4),
('False Ceiling',      'false-ceiling',     'Designer false ceilings with integrated LED lighting.',    '💡', 55.00, 120.00, 5),
('Complete Makeover',  'complete-makeover', 'Full room transformation — walls, ceiling, flooring.',    '🛠️', 500.00,5000.00,6);

-- ============================================
-- SEED DATA - Testimonials
-- ============================================
INSERT IGNORE INTO testimonials (client_name, city, rating, review, service_used, display_order) VALUES
('Rahul Kumar',  'Delhi',     5, 'Absolutely transformed my living room. Clean and fast installation!',     'PVC Wall Panels',    1),
('Sneha Patel',  'Mumbai',    5, 'Renovated our entire office. The result is stunning!',                    'Complete Makeover',   2),
('Arjun Mehta',  'Bangalore', 5, 'The 3D wall panels in my bedroom are incredible.',                        '3D Wall Panels',      3),
('Priya Singh',  'Lucknow',   5, 'On-time delivery, no hidden charges. Exceeded my expectations!',          'PVC Ceiling Panels',  4),
('Vikram Gupta', 'Noida',     5, 'Best decision during home renovation. Waterproof and luxurious!',         'PVC Ceiling Panels',  5);

-- ============================================
-- SEED DATA - Site Settings
-- ============================================
INSERT IGNORE INTO site_settings (`key`, value) VALUES
('business_name',    'PanelCraft Pro'),
('business_phone',   '+91 98765 43210'),
('business_email',   'info@panelcraftpro.com'),
('business_address', '123 Interior Hub, Sector 18, Noida, UP - 201301'),
('whatsapp_number',  '919876543210'),
('hero_title',       'Transform Your Space with Premium PVC Panels'),
('hero_subtitle',    'Professional installation for homes, offices & commercial spaces');
