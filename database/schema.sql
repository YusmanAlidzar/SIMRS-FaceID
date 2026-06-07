-- Create database
CREATE DATABASE IF NOT EXISTS simrs_faceid;
USE simrs_faceid;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'receptionist') DEFAULT 'receptionist',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nik VARCHAR(20) UNIQUE,
  gender ENUM('Laki-laki', 'Perempuan') NOT NULL,
  age INT,
  birth_date DATE,
  address TEXT,
  phone VARCHAR(20),
  photo_url VARCHAR(255),
  status ENUM('Inpatient', 'Outpatient', 'Critical', 'Discharged') DEFAULT 'Outpatient',
  registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  face_encoding LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Poliklinik table
CREATE TABLE poliklinik (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  doctor_name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visits table
CREATE TABLE visits (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL,
  poliklinik_id VARCHAR(50) NOT NULL,
  doctor_id INT,
  visit_time TIME,
  visit_date DATE NOT NULL,
  status ENUM('Antri', 'Pemeriksaan', 'Selesai', 'Menunggu', 'Gawat', 'Diperiksa') DEFAULT 'Antri',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (poliklinik_id) REFERENCES poliklinik(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  INDEX idx_date (visit_date),
  INDEX idx_patient (patient_id)
);

-- Daily statistics table
CREATE TABLE daily_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visit_date DATE NOT NULL,
  poliklinik_id VARCHAR(50),
  total_visits INT DEFAULT 0,
  completed_visits INT DEFAULT 0,
  pending_visits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poliklinik_id) REFERENCES poliklinik(id),
  UNIQUE KEY unique_daily_poly (visit_date, poliklinik_id)
);

-- Notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('urgent', 'info') DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type)
);

-- Insert default poliklinik data
INSERT INTO poliklinik (id, name, code, doctor_name, icon, description) VALUES
('poly-umum', 'Poli Umum', 'UMM', 'dr. H. Ahmad Fauzi, M.Kes', 'Stethoscope', 'Pemeriksaan umum dan penanganan keluhan pertama pasien.'),
('poly-anak', 'Poli Anak', 'ANK', 'dr. Andi Wijaya, Sp.A', 'Baby', 'Spesialis kesehatan bayi, anak-anak, dan tumbuh kembang.'),
('poly-kandungan', 'Poli Kandungan', 'OBG', 'dr. Maria Ulfa, Sp.OG', 'HeartPulse', 'Pemeriksaan kehamilan, kesehatan reproduksi, dan janin.'),
('poly-penyakit-dalam', 'Poli Penyakit Dalam', 'PDL', 'dr. Budi Setiawan, Sp.PD', 'ShieldAlert', 'Penanganan penyakit organ dalam lambung, paru-paru, dll.'),
('poly-jantung', 'Poli Jantung', 'JNT', 'dr. Siska Amelia, Sp.JP', 'Activity', 'Layanan spesialis diagnosis dan terapi jantung & pembuluh darah.'),
('poly-orthopedi', 'Poli Orthopedi', 'ORT', 'dr. Hendra Pratama, Sp.OT', 'Bone', 'Perawatan cedera tulang, sendi, otot, dan ligamen rangka.'),
('poly-saraf', 'Poli Saraf', 'SRF', 'dr. Rian Hidayat, Sp.N', 'Brain', 'Diagnosis dan penanganan gangguan otak, saraf, dan sumsum.'),
('poly-gigi', 'Poli Gigi', 'GIG', 'drg. Fitria Lestari', 'Smile', 'Pelayanan kebersihan mulut, gigi berlubang, dan ortodonsi.');