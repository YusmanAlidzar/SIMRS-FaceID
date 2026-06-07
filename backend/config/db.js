const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// File database akan otomatis terbuat di root folder backend dengan nama 'database.sqlite'
const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Gagal terhubung ke SQLite:', err.message);
  } else {
    console.log('Sukses terhubung ke SQLite! (File: database.sqlite)');
  }
});

db.run('PRAGMA foreign_keys = ON');

const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const query = async (sql, params = []) => {
  const normalized = sql.trim().toUpperCase();
  if (normalized.startsWith('SELECT') || normalized.startsWith('PRAGMA') || normalized.startsWith('WITH')) {
    const rows = await allAsync(sql, params);
    return [rows];
  }

  const result = await runAsync(sql, params);
  return [result];
};

const getConnection = async () => ({
  query,
  release: () => {},
});

// Fitur Sakti: Otomatis membuat tabel saat aplikasi pertama kali dijalankan
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'receptionist',
      name TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nik TEXT UNIQUE,
      gender TEXT NOT NULL,
      age INTEGER,
      birth_date TEXT,
      address TEXT,
      phone TEXT,
      photo_url TEXT,
      status TEXT NOT NULL DEFAULT 'Outpatient',
      registered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      face_encoding TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS poliklinik (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      doctor_name TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      poliklinik_id TEXT NOT NULL,
      doctor_id INTEGER,
      visit_time TEXT,
      visit_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Antri',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (poliklinik_id) REFERENCES poliklinik(id),
      FOREIGN KEY (doctor_id) REFERENCES users(id)
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO poliklinik (id, name, code, doctor_name, icon, description)
    VALUES
      ('poly-umum', 'Poli Umum', 'UMM', 'dr. H. Ahmad Fauzi, M.Kes', 'Stethoscope', 'Pemeriksaan umum dan penanganan keluhan pertama pasien.'),
      ('poly-anak', 'Poli Anak', 'ANK', 'dr. Andi Wijaya, Sp.A', 'Baby', 'Spesialis kesehatan bayi, anak-anak, dan tumbuh kembang.'),
      ('poly-kandungan', 'Poli Kandungan', 'OBG', 'dr. Maria Ulfa, Sp.OG', 'HeartPulse', 'Pemeriksaan kehamilan, kesehatan reproduksi, dan janin.'),
      ('poly-penyakit-dalam', 'Poli Penyakit Dalam', 'PDL', 'dr. Budi Setiawan, Sp.PD', 'ShieldAlert', 'Penanganan penyakit organ dalam lambung, paru-paru, dll.'),
      ('poly-jantung', 'Poli Jantung', 'JNT', 'dr. Siska Amelia, Sp.JP', 'Activity', 'Layanan spesialis diagnosis dan terapi jantung & pembuluh darah.'),
      ('poly-orthopedi', 'Poli Orthopedi', 'ORT', 'dr. Hendra Pratama, Sp.OT', 'Bone', 'Perawatan cedera tulang, sendi, otot, dan ligamen rangka.'),
      ('poly-saraf', 'Poli Saraf', 'SRF', 'dr. Rian Hidayat, Sp.N', 'Brain', 'Diagnosis dan penanganan gangguan otak, saraf, dan sumsum.'),
      ('poly-gigi', 'Poli Gigi', 'GIG', 'drg. Fitria Lestari', 'Smile', 'Pelayanan kebersihan mulut, gigi berlubang, dan ortodonsi.')
  `);
});

module.exports = {
  getConnection,
  db,
};