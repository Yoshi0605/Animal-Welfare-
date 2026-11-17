USE pawhaven;
ALTER TABLE animals MODIFY species VARCHAR(40) NOT NULL DEFAULT 'Dog';
UPDATE animals SET species=CONCAT(UPPER(LEFT(species,1)),SUBSTRING(species,2));
