const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Mengarah ke file database.sqlite di root folder backend
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Gagal terhubung ke SQLite:', err.message);
  else console.log('✓ Database SQLite (Adapter) connected successfully');
});

db.run('PRAGMA foreign_keys = ON');

const POLIKLINIK_SEED = [
  ['poly-saraf', 'Poli Saraf', 'SRF', 'dr. Rian Hidayat, Sp.N', 'Brain', 'Diagnosis dan penanganan gangguan otak, saraf, dan sumsum.'],
  ['poly-gigi', 'Poli Gigi', 'GIG', 'drg. Fitria Lestari', 'Smile', 'Pelayanan kebersihan mulut, gigi berlubang, dan ortodonsi.'],
  ['poly-mata', 'Poli Mata', 'MAT', 'dr. Yusuf Hamdan, Sp.M', 'Eye', 'Spesialisasi gangguan penglihatan, katarak, dan kacamata.'],
  ['poly-tht', 'Poli THT', 'THT', 'dr. Dina Mariana, Sp.THT-KL', 'Ear', 'Pemeriksaan hidung, tenggorokan, dan fungsi pendengaran.'],
  ['poly-kulit', 'Poli Kulit & Kelamin', 'KK', 'dr. Susan Anggraini, Sp.DV', 'Sparkles', 'Layanan terapi kecantikan kulit, alergi, dan infeksi luar.'],
  ['poly-psikiatri', 'Poli Psikiatri', 'PSI', 'dr. Ridwan Chaniago, Sp.KJ', 'HeartHandshake', 'Konsultasi kesehatan jiwa, konseling stress, dan depresi.'],
];

db.all('PRAGMA table_info(visits)', [], (err, columns) => {
  if (err) {
    console.error('Gagal membaca schema visits:', err.message);
    return;
  }

  const columnNames = (columns || []).map((col) => col.name);
  if (!columnNames.includes('visit_time')) {
    db.run('ALTER TABLE visits ADD COLUMN visit_time TEXT DEFAULT CURRENT_TIME', (alterErr) => {
      if (alterErr) console.error('Gagal menambahkan kolom visit_time:', alterErr.message);
      else console.log('✓ Added missing visits.visit_time column');
    });
  }

  if (!columnNames.includes('created_at')) {
    db.run('ALTER TABLE visits ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP', (alterErr) => {
      if (alterErr) console.error('Gagal menambahkan kolom created_at ke visits:', alterErr.message);
      else console.log('✓ Added missing visits.created_at column');
    });
  }
});

db.all('SELECT id FROM poliklinik', [], (err, rows) => {
  if (err) {
    console.error('Gagal membaca table poliklinik:', err.message);
    return;
  }

  const existingIds = new Set((rows || []).map((row) => row.id));
  POLIKLINIK_SEED.forEach((poliklinik) => {
    const [id, name, code, doctorName, icon, description] = poliklinik;
    if (!existingIds.has(id)) {
      db.run(
        'INSERT INTO poliklinik (id, name, code, doctor_name, icon, description) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, code, doctorName, icon, description],
        (insertErr) => {
          if (insertErr) {
            console.error(`Gagal menyisipkan poliklinik ${id}:`, insertErr.message);
          } else {
            console.log(`✓ Seeded missing poliklinik: ${id}`);
          }
        }
      );
    }
  });
});

const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      // SQLite menggunakan "this.lastID", tapi kita samarkan menjadi "insertId" agar mirip MySQL
      resolve({ insertId: this.lastID, affectedRows: this.changes });
    });
  });
};

const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// =========================================================================
// ADAPTER PATTERN: Memanipulasi SQLite agar bisa dibaca oleh Controller MySQL
// =========================================================================
const getConnection = async () => {
  return {
    query: async (sql, params) => {
      const isSelect = sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('PRAGMA');
      if (isSelect) {
        const rows = await allAsync(sql, params);
        return [rows, []]; // Return array [rows, fields] persis seperti mysql2
      } else {
        const result = await runAsync(sql, params);
        return [result, []]; 
      }
    },
    release: () => {
      // Void (Kosongkan) karena SQLite tidak butuh melepaskan pool connection
    }
  };
};

module.exports = { getConnection };