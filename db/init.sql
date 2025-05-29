-- Customers table: includes spend, visits, last_active, last_purchase_date, inactive_days for segmentation
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  spend INT DEFAULT 0,
  visits INT DEFAULT 0,
  last_active DATE,
  last_purchase_date DATE,
  inactive_days INT DEFAULT 0
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATETIME NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Campaigns table: includes message, segmentRules, audienceSize, sent, failed, status, createdAt
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  message TEXT,
  segmentRules JSON,
  audienceSize INT,
  sent INT,
  failed INT,
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication log for delivery tracking
CREATE TABLE IF NOT EXISTS communication_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  customer_id INT NOT NULL,
  status ENUM('sent', 'failed') DEFAULT 'sent',
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Users table for Google OAuth
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255)
);