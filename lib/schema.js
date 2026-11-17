// Creates missing tables/columns automatically so no manual migrations are needed.
const T = [
  `CREATE TABLE IF NOT EXISTS animals(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(80),species VARCHAR(40) NOT NULL DEFAULT 'Dog',age VARCHAR(40),sex VARCHAR(10),description TEXT,photo MEDIUMTEXT,status ENUM('available','pending','adopted') DEFAULT 'available',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS reports(id INT AUTO_INCREMENT PRIMARY KEY,reporter_name VARCHAR(80),contact VARCHAR(120),species VARCHAR(20),description TEXT,address VARCHAR(400),lat DECIMAL(10,7) NULL,lng DECIMAL(10,7) NULL,photo MEDIUMTEXT,urgency VARCHAR(30) DEFAULT 'Needs help soon',animal_count INT DEFAULT 1,injured VARCHAR(12) DEFAULT 'Not sure',still_there VARCHAR(12) DEFAULT 'Not sure',code VARCHAR(16) UNIQUE,status ENUM('new','dispatched','rescued','closed') DEFAULT 'new',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS adoption_requests(id INT AUTO_INCREMENT PRIMARY KEY,animal_id INT,name VARCHAR(80),contact VARCHAR(120),message TEXT,code VARCHAR(16) UNIQUE,status ENUM('pending','approved','rejected') DEFAULT 'pending',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS donations(id INT AUTO_INCREMENT PRIMARY KEY,donor_name VARCHAR(80),contact VARCHAR(120),amount DECIMAL(10,2),method VARCHAR(20),reference VARCHAR(80),bank VARCHAR(40),anonymous TINYINT(1) DEFAULT 0,receipt MEDIUMTEXT,purpose VARCHAR(40) DEFAULT 'Where needed most',code VARCHAR(16) UNIQUE,status ENUM('pending','confirmed') DEFAULT 'pending',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS feedback(id INT AUTO_INCREMENT PRIMARY KEY,rating TINYINT,role VARCHAR(30),message TEXT,contact VARCHAR(120),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
];
const COLS = [['reports', 'code', 'VARCHAR(16) UNIQUE'], ['reports', 'urgency', "VARCHAR(30) DEFAULT 'Needs help soon'"], ['reports', 'animal_count', 'INT DEFAULT 1'], ['reports', 'injured', "VARCHAR(12) DEFAULT 'Not sure'"], ['reports', 'still_there', "VARCHAR(12) DEFAULT 'Not sure'"], ['adoption_requests', 'code', 'VARCHAR(16) UNIQUE'], ['donations', 'code', 'VARCHAR(16) UNIQUE'], ['donations', 'bank', 'VARCHAR(40) NULL'], ['donations', 'anonymous', 'TINYINT(1) DEFAULT 0'], ['donations', 'receipt', 'MEDIUMTEXT NULL']];
export async function ensure(db) {
  try {
    for (const s of T) await db.query(s);
    await db.query("ALTER TABLE animals MODIFY species VARCHAR(40) NOT NULL DEFAULT 'Dog'");
    await db.query('ALTER TABLE reports MODIFY address VARCHAR(400)');
    for (const [t, c, d] of COLS) {
      const [r] = await db.query('SELECT COUNT(*) n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?', [t, c]);
      if (!r[0].n) await db.query(`ALTER TABLE ${t} ADD ${c} ${d}`);
    }
  } catch (e) { console.error('Schema check failed:', e.message); }
}
