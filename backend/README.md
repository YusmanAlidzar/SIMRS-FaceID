# SIMRS Face ID Backend Server

Backend server untuk SIMRS (Sistem Informasi Manajemen Rumah Sakit) dengan fitur Face ID Recognition dan Queue Management.

## 📁 Struktur Project

```
backend/
├── config/
│   └── db.js              # Koneksi MySQL Pool
├── controllers/
│   ├── authController.js  # Logika Face ID & Verifikasi Pasien
│   └── queueController.js # Logika Pembuat Nomor Antrean
├── routes/
│   └── apiRoutes.js       # Daftar Endpoint/Jalur API
├── .env                   # Konfigurasi Database & Server
├── package.json           # Dependencies
└── server.js              # File Utama Server
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14 atau lebih tinggi
- MySQL 5.7 atau MariaDB 10.3+
- npm atau yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup Database:**
```bash
# Login ke MySQL
mysql -u root -p

# Jalankan schema
source ../database/schema.sql
```

3. **Configure Environment:**
```bash
# Edit file .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=simrs_faceid
PORT=5000
NODE_ENV=development
```

4. **Start Server:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📡 API Endpoints

### Authentication & Face ID
- `POST /api/auth/login` - Login dengan username & password
- `POST /api/auth/register-face` - Register pasien baru dengan Face ID
- `POST /api/auth/verify-face` - Verifikasi Face ID pasien
- `POST /api/auth/update-face` - Update face encoding pasien

### Patients
- `GET /api/patients` - Dapatkan semua pasien
- `GET /api/patients/:id` - Dapatkan detail pasien
- `GET /api/patients/search/:query` - Search pasien berdasarkan nama atau NIK

### Queue Management
- `POST /api/queue/generate` - Generate nomor antrean baru
- `GET /api/queue/current` - Dapatkan antrean hari ini
- `GET /api/queue/:poliklinik_id/:date` - Dapatkan antrean per poliklinik & tanggal
- `GET /api/queue/ticket/:ticket_id` - Dapatkan info ticket pasien
- `PUT /api/queue/update-status` - Update status antrean
- `GET /api/queue/stats/today` - Statistik antrean hari ini

### Health Check
- `GET /api/health` - Cek status server

## 📚 Database Schema

Lihat `../database/schema.sql` untuk detail struktur database:

| Tabel | Fungsi |
|-------|--------|
| `users` | User/staff rumah sakit |
| `patients` | Data pasien dengan face encoding |
| `poliklinik` | Daftar poliklinik/klinik |
| `visits` | Riwayat kunjungan & nomor antrean |
| `daily_statistics` | Statistik harian kunjungan |
| `notifications` | Notifikasi sistem |

## 🔑 Key Features

### 1. Face ID Recognition
- Register pasien dengan face encoding
- Verifikasi wajah untuk check-in otomatis
- Hitung distance/similarity antar face

### 2. Queue Management
- Generate nomor antrean otomatis
- Track status antrean (Antri, Pemeriksaan, Selesai)
- Statistik real-time per poliklinik

### 3. Patient Management
- Database pasien dengan NIK & foto
- Update status pasien (Inpatient, Outpatient, etc)
- Search pasien by nama atau NIK

## 📝 API Request Examples

### Generate Queue Ticket
```bash
POST /api/queue/generate
Content-Type: application/json

{
  "patient_id": "PT-2024-001",
  "poliklinik_id": "poly-umum",
  "visit_date": "2024-06-06"
}

Response: 201
{
  "success": true,
  "ticket": {
    "ticketId": "POLY-UMUM-20240606-001",
    "queueNumber": "001",
    "patientName": "Ahmad Wijaya",
    "poliklinik": "Poli Umum",
    "status": "Antri"
  }
}
```

### Verify Face ID
```bash
POST /api/auth/verify-face
Content-Type: application/json

{
  "face_encoding": [0.1, 0.2, 0.3, ...],
  "tolerance": 0.6
}

Response: 200
{
  "success": true,
  "patient": {
    "id": "PT-2024-001",
    "name": "Ahmad Wijaya",
    "gender": "Laki-laki",
    "age": 35
  },
  "confidence": 92.5
}
```

## ⚠️ Production Security Notes

Untuk deployment ke production:
- [ ] Gunakan **bcrypt** untuk hashing password
- [ ] Implement **JWT** authentication token
- [ ] Add **request validation** middleware
- [ ] Add **rate limiting** untuk prevent abuse
- [ ] Use **HTTPS** instead of HTTP
- [ ] Configure **CORS** properly
- [ ] Monitor **database connection** pooling
- [ ] Add **error logging** & monitoring
- [ ] Use proper **face recognition library** (face-api.js, deepface, etc)
- [ ] Implement **database backups** strategy

## 🛠️ Troubleshooting

### Database Connection Error
```
✗ Database connection failed: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Pastikan MySQL sudah running dan konfigurasi `.env` benar

### Port Already in Use
```
listen EADDRINUSE: address already in use :::5000
```
**Solution:** Ubah PORT di `.env` atau kill process yang pakai port 5000

### Face Encoding Not Valid
Pastikan face_encoding adalah array of numbers, bukan string

## 📖 Further Reading

- MySQL Documentation: https://dev.mysql.com/doc/
- Express.js Guide: https://expressjs.com/
- Face Recognition: https://github.com/justadudewhohacks/face-api.js

## 👨‍💻 Support

Untuk pertanyaan atau issue, hubungi tim development.
