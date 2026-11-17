USE pawhaven;
ALTER TABLE reports ADD urgency VARCHAR(30) DEFAULT 'Needs help soon', ADD animal_count INT DEFAULT 1;
ALTER TABLE donations ADD bank VARCHAR(40) NULL, ADD anonymous TINYINT(1) DEFAULT 0, ADD receipt MEDIUMTEXT NULL;
