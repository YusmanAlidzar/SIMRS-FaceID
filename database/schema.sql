-- Hapus tabel jika sudah ada agar tidak bentrok
DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS poliklinik;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notifications;

-- Tabel Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'receptionist',
  name TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Patients
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nik TEXT UNIQUE,
  gender TEXT NOT NULL,
  age INTEGER,
  birth_date DATE,
  address TEXT,
  phone TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'Outpatient',
  registered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  face_encoding TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Poliklinik
CREATE TABLE poliklinik (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  doctor_name TEXT NOT NULL,
  icon TEXT,
  description TEXT
);

-- Tabel Visits
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id TEXT UNIQUE NOT NULL,
  patient_id TEXT NOT NULL,
  poliklinik_id TEXT NOT NULL,
  doctor_id INTEGER,
  queue_number TEXT NOT NULL,
  status TEXT DEFAULT 'Menunggu',
  visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  visit_time TEXT DEFAULT CURRENT_TIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (poliklinik_id) REFERENCES poliklinik(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Tabel Notifications
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'info',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Masukkan Data Poliklinik Default
INSERT INTO poliklinik (id, name, code, doctor_name, icon, description) VALUES
('poly-umum', 'Poli Umum', 'UMM', 'dr. H. Ahmad Fauzi, M.Kes', 'Stethoscope', 'Pemeriksaan umum dan penanganan keluhan pertama pasien.'),
('poly-anak', 'Poli Anak', 'ANK', 'dr. Andi Wijaya, Sp.A', 'Baby', 'Spesialis kesehatan bayi, anak-anak, dan tumbuh kembang.'),
('poly-kandungan', 'Poli Kandungan', 'OBG', 'dr. Maria Ulfa, Sp.OG', 'HeartPulse', 'Pemeriksaan kehamilan, kesehatan reproduksi, dan janin.'),
('poly-penyakit-dalam', 'Poli Penyakit Dalam', 'PDL', 'dr. Budi Setiawan, Sp.PD', 'ShieldAlert', 'Penanganan penyakit organ dalam lambung, paru-paru, dll.'),
('poly-jantung', 'Poli Jantung', 'JNT', 'dr. Siska Amelia, Sp.JP', 'Activity', 'Layanan spesialis diagnosis dan terapi jantung & pembuluh darah.'),
('poly-orthopedi', 'Poli Orthopedi', 'ORT', 'dr. Hendra Pratama, Sp.OT', 'Bone', 'Perawatan cedera tulang, sendi, otot, dan ligamen rangka.'),
('poly-saraf', 'Poli Saraf', 'SRF', 'dr. Rian Hidayat, Sp.N', 'Brain', 'Diagnosis dan penanganan gangguan otak, saraf, dan sumsum.'),
('poly-gigi', 'Poli Gigi', 'GIG', 'drg. Fitria Lestari', 'Smile', 'Pelayanan kebersihan mulut, gigi berlubang, dan ortodonsi.'),
('poly-mata', 'Poli Mata', 'MAT', 'dr. Yusuf Hamdan, Sp.M', 'Eye', 'Spesialisasi gangguan penglihatan, katarak, dan kacamata.'),
('poly-tht', 'Poli THT', 'THT', 'dr. Dina Mariana, Sp.THT-KL', 'Ear', 'Pemeriksaan hidung, tenggorokan, dan fungsi pendengaran.'),
('poly-kulit', 'Poli Kulit & Kelamin', 'KK', 'dr. Susan Anggraini, Sp.DV', 'Sparkles', 'Layanan terapi kecantikan kulit, alergi, dan infeksi luar.'),
('poly-psikiatri', 'Poli Psikiatri', 'PSI', 'dr. Ridwan Chaniago, Sp.KJ', 'HeartHandshake', 'Konsultasi kesehatan jiwa, konseling stress, dan depresi.');