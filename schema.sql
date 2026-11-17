CREATE DATABASE IF NOT EXISTS pawhaven;

USE pawhaven;

CREATE TABLE animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80),
    species VARCHAR(40) NOT NULL DEFAULT 'Dog',
    age VARCHAR(40),
    sex VARCHAR(10),
    description TEXT,
    photo MEDIUMTEXT,
    status ENUM(
        'available',
        'pending',
        'adopted'
    ) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_name VARCHAR(80),
    contact VARCHAR(120),
    species VARCHAR(20),
    description TEXT,
    address VARCHAR(255),
    lat DECIMAL(10, 7) NULL,
    lng DECIMAL(10, 7) NULL,
    photo MEDIUMTEXT,
    urgency VARCHAR(30) DEFAULT 'Needs help soon',
    animal_count INT DEFAULT 1,
    code VARCHAR(16) UNIQUE,
    status ENUM(
        'new',
        'dispatched',
        'rescued',
        'closed'
    ) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adoption_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT,
    name VARCHAR(80),
    contact VARCHAR(120),
    message TEXT,
    code VARCHAR(16) UNIQUE,
    status ENUM(
        'pending',
        'approved',
        'rejected'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals (id)
);

CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(80),
    contact VARCHAR(120),
    amount DECIMAL(10, 2),
    method VARCHAR(20),
    reference VARCHAR(80),
    bank VARCHAR(40),
    anonymous TINYINT(1) DEFAULT 0,
    receipt MEDIUMTEXT,
    code VARCHAR(16) UNIQUE,
    status ENUM('pending', 'confirmed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
    animals (
        name,
        species,
        age,
        sex,
        description
    )
VALUES (
        'Biscuit',
        'Dog',
        '8 months',
        'Male',
        'Playful pup found near a market. Vaccinated, loves belly rubs.'
    ),
    (
        'Mingming',
        'Cat',
        '2 years',
        'Female',
        'Calm tortie who sits on any lap. Good with kids.'
    ),
    (
        'Mango',
        'Dog',
        '3 years',
        'Male',
        'Gentle golden boy, leash trained, great with other dogs.'
    );

ALTER TABLE reports
ADD injured VARCHAR(12) DEFAULT 'Not sure',
ADD still_there VARCHAR(12) DEFAULT 'Not sure';

ALTER TABLE donations
ADD purpose VARCHAR(40) DEFAULT 'Where needed most';

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating TINYINT,
    role VARCHAR(30),
    message TEXT,
    contact VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);