USE pawhaven;
ALTER TABLE reports ADD injured VARCHAR(12) DEFAULT 'Not sure', ADD still_there VARCHAR(12) DEFAULT 'Not sure';
ALTER TABLE donations ADD purpose VARCHAR(40) DEFAULT 'Where needed most';
CREATE TABLE IF NOT EXISTS feedback(id INT AUTO_INCREMENT PRIMARY KEY,rating TINYINT,role VARCHAR(30),message TEXT,contact VARCHAR(120),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
